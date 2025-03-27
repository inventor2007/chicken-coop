import RPi.GPIO as GPIO
import time
from gpiozero import LightSensor, Button, Servo
from flask import Flask, jsonify, request

app = Flask(__name__)

ldr = LightSensor(17)
flotteur = Button(19)
servo = Servo(16)
porte_status = False

def detecter_lumiere():
    return ldr.light_detected

def detecter_flotteur():
    return flotteur.is_pressed

def ouvrir_porte():
    global porte_status
    servo.value = 0.5  # Ouvrir la porte
    porte_status = True

def fermer_porte():
    global porte_status
    servo.value = 0  # Fermer la porte
    porte_status = False

@app.route('/lumiere', methods=['GET'])
def lumiere():
    try:
        # Vérifier l'état du capteur et renvoyer la réponse JSON
        if detecter_lumiere():
            return jsonify({"lumiere_detectee": True}), 200  # Lumière détectée (jour)
        else:
            return jsonify({"lumiere_detectee": False}), 200  # Pas de lumière (nuit)
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

@app.route('/flotteur', methods=['GET'])
def flotteur_status():
    try:
        # Vérifier l'état du flotteur et renvoyer la réponse JSON
        if detecter_flotteur():
            return jsonify({"flotteur_active": True}), 200  # Flotteur activé
        else:
            return jsonify({"flotteur_active": False}), 200  # Flotteur désactivé
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

@app.route('/porte', methods=['GET'])
def status_porte():
    try:
        # Retourner le statut actuel de la porte (True = ouverte, False = fermée)
        return jsonify({"porte_status": porte_status}), 200
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

@app.route('/porte', methods=['POST'])
def action_porte():
    try:
        # Récupérer l'action depuis les données JSON de la requête
        data = request.get_json()
        action = data.get("action")

        if action == "ouvrir":
            ouvrir_porte()
            return jsonify({"message": "Porte ouverte", "porte_status": porte_status}), 200
        elif action == "fermer":
            fermer_porte()
            return jsonify({"message": "Porte fermee", "porte_status": porte_status}), 200
        else:
            return jsonify({"erreur": "Action invalide"}), 400
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

if __name__ == '__main__':
    try:
        # Démarrage du serveur Flask sur le port 5000
        app.run(host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        GPIO.cleanup()  # Nettoyer les GPIO lorsque le programme est interrompu