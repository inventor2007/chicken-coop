from gpiozero import LightSensor, Button, Servo, AngularServo
from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Activer CORS sur toutes les routes

ldr = LightSensor(17)
flotteur = Button(19)
servo = AngularServo(16)
porte_status = False
auto_mode = False
servo.detach()

def detecter_lumiere():
    return ldr.light_detected

def detecter_flotteur():
    return flotteur.is_pressed

def ouvrir_porte():
    global porte_status
    servo.value = 1  # Tourner pour ouvrir
    time.sleep(1)  # Ajustez le délai en fonction de votre matériel
    servo.value = 0  # Arrêter le servo
    porte_status = True
    servo.detach()

def fermer_porte():
    global porte_status
    servo.value = -1  # Tourner pour fermer
    time.sleep(1)  # Ajustez le délai en fonction de votre matériel
    servo.value = 0  # Arrêter le servo
    porte_status = False
    servo.detach()

def set_automode(mode):
    global auto_mode
    auto_mode = mode

def get_automode():
    return auto_mode


@app.route('/allstats', methods=['GET'])
def allstats():
    try:
        # Récupérer les états actuels des capteurs et de la porte
        lumiere = detecter_lumiere()
        flotteur = detecter_flotteur()
        return jsonify({"lumiere_detectee": lumiere, "flotteur_active": flotteur, "porte_status": porte_status, "auto_mode": auto_mode}), 200
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

@app.route('/automode', methods=['GET'])
def status_automode():
    try:
        # Renvoyer l'état actuel du mode automatique
        return jsonify({"auto_mode": auto_mode}), 200
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

@app.route('/automode', methods=['POST'])
def action_automode():
    try:
        # Récupérer l'action depuis les données JSON de la requête
        data = request.get_json()
        action = data.get("action")

        if action == "activer":
            set_automode(True)
            return jsonify({"message": "Mode automatique active", "auto_mode": auto_mode}), 200
        elif action == "desactiver":
            set_automode(False)
            return jsonify({"message": "Mode automatique desactive", "auto_mode": auto_mode}), 200
        else:
            return jsonify({"erreur": "Action invalide"}), 400
    except Exception as e:
        return jsonify({"erreur": str(e)}), 500

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
    app.run(host='0.0.0.0', port=5000)