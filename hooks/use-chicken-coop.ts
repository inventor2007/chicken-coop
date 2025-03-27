import { useState, useEffect } from 'react';

interface ChickenCoopState {
  door: {
    isOpen: boolean;
  };
  food: {
    weight: number;
    percentage: number;
  };
  water: {
    level: number;
  };
  light: {
    current: number;
    autoMode: boolean;
  };
}

const STORAGE_KEY = 'chicken-coop-state';
const API_BASE_URL = 'http://127.0.0.1:5000'; // URL de base de l'API

// Données par défaut
const defaultState: ChickenCoopState = {
  door: { isOpen: false },
  food: { weight: 75, percentage: 65 },
  water: { level: 50 },
  light: { current: 50, autoMode: true },
};

// Fonction pour récupérer l'état initial depuis l'API
const getInitialState = async (): Promise<ChickenCoopState> => {
  try {
    const response = await fetch(`${API_BASE_URL}/allstats`);
    if (response.ok) {
      const data = await response.json();
      return {
        door: { isOpen: data.porte_status },
        food: { weight: 75, percentage: 65 }, // Ajustez si des données alimentaires sont disponibles
        water: { level: data.flotteur_active ? 100 : 0 }, // Exemple basé sur le flotteur
        light: { current: data.lumiere_detectee ? 100 : 0, autoMode: data.auto_mode }, // Exemple basé sur la lumière
      };
    } else {
      console.error('Erreur lors de la récupération des stats:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur API getInitialState:', error);
  }

  return defaultState;
};

export const useChickenCoop = () => {
  const [state, setState] = useState<ChickenCoopState>(defaultState); // Initialiser avec l'état par défaut
  const [isLoading, setIsLoading] = useState<boolean>(true); // Ajout de l'état de chargement

  useEffect(() => {
    const fetchInitialState = async () => {
      setIsLoading(true); // Début du chargement
      const initialState = await getInitialState();
      setState(initialState); // Mettre à jour l'état
      setIsLoading(false); // Fin du chargement
    };

    fetchInitialState();
  }, []);

  // Sauvegarder l'état dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Fonction pour ouvrir/fermer la porte
  const toggleDoor = async (isOpen: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/porte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: isOpen ? 'ouvrir' : 'fermer' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la porte');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        door: { ...prev.door, isOpen: data.porte_status },
      }));
    } catch (error) {
      console.error('Erreur API toggleDoor:', error);
    }
  };

  // Fonction pour mettre à jour le niveau de nourriture
  const updateFoodLevel = (weight: number) => {
    const percentage = Math.min(100, Math.max(0, (weight / 100) * 100));
    setState(prev => ({
      ...prev,
      food: {
        weight,
        percentage,
      },
    }));
  };

  // Fonction pour mettre à jour le niveau d'eau
  const updateWaterLevel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/flotteur`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du niveau d\'eau');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        water: { level: data.flotteur_active ? 100 : 0 }, // 100 si activé, 0 sinon
      }));
    } catch (error) {
      console.error('Erreur API updateWaterLevel:', error);
    }
  };

  // Fonction pour activer/désactiver le mode automatique
  const toggleAutoMode = async (enabled: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/automode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: enabled ? 'activer' : 'desactiver' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du mode automatique');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        light: { ...prev.light, autoMode: data.auto_mode },
      }));
    } catch (error) {
      console.error('Erreur API toggleAutoMode:', error);
    }
  };

  // Simulation des mises à jour automatiques
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        water: { level: Math.floor(Math.random() * 100) },
        food: {
          weight: Math.floor(Math.random() * 100),
          percentage: Math.floor(Math.random() * 100),
        },
        light: {
          ...prev.light,
          current: Math.floor(Math.random() * 100),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    isLoading, // Retourne l'état de chargement
    actions: {
      toggleDoor,
      updateFoodLevel,
      updateWaterLevel,
      toggleAutoMode,
    },
  };
};
