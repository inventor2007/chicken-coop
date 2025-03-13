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
    dayThreshold: number;
    nightThreshold: number;
    autoMode: boolean;
  };
}

const STORAGE_KEY = 'chicken-coop-state';

const getInitialState = (): ChickenCoopState => {
  if (typeof window === 'undefined') {
    return {
      door: {
        isOpen: false,
      },
      food: {
        weight: 75,
        percentage: 65,
      },
      water: {
        level: 50,
      },
      light: {
        current: 50,
        dayThreshold: 70,
        nightThreshold: 30,
        autoMode: true,
      },
    };
  }

  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (error) {
      console.error('Error parsing saved state:', error);
    }
  }

  return {
    door: {
      isOpen: false,
    },
    food: {
      weight: 75,
      percentage: 65,
    },
    water: {
      level: 50,
    },
    light: {
      current: 50,
      dayThreshold: 70,
      nightThreshold: 30,
      autoMode: true,
    },
  };
};

export const useChickenCoop = () => {
  const [state, setState] = useState<ChickenCoopState>(getInitialState());

  // Sauvegarder l'état dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Fonction pour ouvrir/fermer la porte
  const toggleDoor = (isOpen: boolean) => {
    setState(prev => ({
      ...prev,
      door: { ...prev.door, isOpen },
    }));
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
  const updateWaterLevel = (level: number) => {
    setState(prev => ({
      ...prev,
      water: { level },
    }));
  };

  // Fonction pour mettre à jour les seuils de luminosité
  const updateLightThresholds = (type: 'day' | 'night', value: number) => {
    setState(prev => ({
      ...prev,
      light: {
        ...prev.light,
        [type === 'day' ? 'dayThreshold' : 'nightThreshold']: value,
      },
    }));
  };

  // Fonction pour activer/désactiver le mode automatique
  const toggleAutoMode = (enabled: boolean) => {
    setState(prev => ({
      ...prev,
      light: { ...prev.light, autoMode: enabled },
    }));
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
    actions: {
      toggleDoor,
      updateFoodLevel,
      updateWaterLevel,
      updateLightThresholds,
      toggleAutoMode,
    },
  };
};