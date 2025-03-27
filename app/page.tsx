"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  DoorClosed,
  Sun, 
  Moon, 
  GaugeCircle, 
  Weight, 
  AlertTriangle,
  CheckCircle2,
  Camera
} from "lucide-react";
import { useChickenCoop } from "@/hooks/use-chicken-coop";

export default function Dashboard() {
  const { state, actions } = useChickenCoop();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary">Poulailler Connecté</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte du niveau d'eau */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GaugeCircle className="h-5 w-5" />
                Niveau d&apos;eau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {state?.water?.level > 50 ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  )}
                  <span className="text-xl">
                    {state?.water?.level > 50 ? "Niveau suffisant" : "Niveau bas"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte de la nourriture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Réservoir de nourriture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col w-full">
                  <div className="w-full h-2 bg-secondary rounded-full mb-2">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${state.food.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{state.food.weight} kg</span>
                    <span className="text-lg font-bold">{state.food.percentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte de la porte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DoorClosed className="h-5 w-5" />
                Contrôle de la porte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg">État de la porte:</span>
                  <span className="text-lg font-bold">
                    {state.door.isOpen ? "Ouverte" : "Fermée"}
                  </span>
                </div>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => actions.toggleDoor(true)}
                    disabled={state.door.isOpen}
                    className="flex-1"
                  >
                    Ouvrir
                  </Button>
                  <Button 
                    onClick={() => actions.toggleDoor(false)}
                    disabled={!state.door.isOpen}
                    className="flex-1"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte de la caméra */}
          <Card className="lg:col-span-1 md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Caméra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black/10 rounded-lg overflow-hidden">
                <img 
                  src="https://lh4.googleusercontent.com/proxy/jtZevXr8nHepHDmo3hAD32CClgqTyZ9II7FXv8pnlXKqtL5XrIybO_afW8B_uXjdEkBClqNGP0e4yMA9PG17LxozHiOmGp_yJ1zjyauDXnzUXqA"
                  alt="Caméra du poulailler"
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Carte de configuration automatique */}
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {state.light.autoMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                Configuration automatique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={state.light.autoMode}
                    onCheckedChange={actions.toggleAutoMode}
                    id="auto-mode"
                  />
                  <Label htmlFor="auto-mode">
                    Mode automatique {state.light.autoMode ? "activé" : "désactivé"}
                  </Label>
                </div>

                <div className="space-y-8">
                  {/* Valeur actuelle */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      Luminosité actuelle
                    </Label>
                    <div className="w-full h-2 bg-secondary rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${state.light.current}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Sombre</span>
                      <span>{state.light.current}%</span>
                      <span>Lumineux</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}