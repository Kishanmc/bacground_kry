import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import LabTable from '../components/3d/LabTable';
import { ChemicalItem, LabContainer, ContainerType, MixedChemical } from '../types';
import { Beaker, FlaskRound as Flask, TestTube } from 'lucide-react';

const ChemistryLab = () => {
  const [selectedContainer, setSelectedContainer] = useState<LabContainer | null>(null);
  const [containers, setContainers] = useState<LabContainer[]>([]);
  const [selectedChemical, setSelectedChemical] = useState<ChemicalItem | null>(null);
  const [volume, setVolume] = useState<number>(50);

  const chemicals: ChemicalItem[] = [
    { 
      id: 1, 
      name: 'Hydrochloric Acid', 
      color: '#C8E6C9', 
      type: 'acid',
      volume: 0,
      maxVolume: 100
    },
    { 
      id: 2, 
      name: 'Sodium Hydroxide', 
      color: '#B3E5FC', 
      type: 'base',
      volume: 0,
      maxVolume: 100
    },
    { 
      id: 3, 
      name: 'Phenolphthalein', 
      color: '#F8BBD0', 
      type: 'indicator',
      volume: 0,
      maxVolume: 100
    },
  ];

  const containerTypes: { type: ContainerType; icon: React.ElementType; maxVolume: number }[] = [
    { type: 'beaker', icon: Beaker, maxVolume: 100 },
    { type: 'test_tube', icon: TestTube, maxVolume: 50 },
    { type: 'flask', icon: Flask, maxVolume: 150 },
  ];

  const addContainer = (type: ContainerType) => {
    const newContainer: LabContainer = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: [containers.length * 1.5 - 1.5, 0, 0],
      maxVolume: containerTypes.find(ct => ct.type === type)?.maxVolume || 100
    };
    setContainers([...containers, newContainer]);
  };

  const mixChemicals = useCallback((container: LabContainer, chemical: ChemicalItem, amount: number) => {
    return setContainers(prev => {
      return prev.map(cont => {
        if (cont.id !== container.id) return cont;

        let newColor = chemical.color;
        let newChemicals = [{ ...chemical, volume: amount }];

        if (cont.chemical) {
          // Simple color mixing logic - average the colors
          const existingColor = cont.chemical.color;
          const existingVolume = cont.chemical.volume;
          const totalVolume = existingVolume + amount;

          // Convert hex to RGB and calculate weighted average
          const existing = hexToRgb(existingColor);
          const new_ = hexToRgb(chemical.color);

          if (existing && new_) {
            const r = Math.round((existing.r * existingVolume + new_.r * amount) / totalVolume);
            const g = Math.round((existing.g * existingVolume + new_.g * amount) / totalVolume);
            const b = Math.round((existing.b * existingVolume + new_.b * amount) / totalVolume);

            newColor = rgbToHex(r, g, b);
          }

          newChemicals = [...cont.chemical.chemicals, { ...chemical, volume: amount }];
        }

        return {
          ...cont,
          chemical: {
            id: Math.random().toString(36).substr(2, 9),
            color: newColor,
            volume: (cont.chemical?.volume || 0) + amount,
            chemicals: newChemicals
          }
        };
      });
    });
  }, []);

  const handlePour = () => {
    if (!selectedContainer || !selectedChemical) return;
    
    const availableSpace = selectedContainer.maxVolume - (selectedContainer.chemical?.volume || 0);
    const amountToPour = Math.min(volume, availableSpace);
    
    if (amountToPour > 0) {
      mixChemicals(selectedContainer, selectedChemical, amountToPour);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Lab Equipment</h2>
          <div className="grid grid-cols-3 gap-4">
            {containerTypes.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => addContainer(type)}
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Icon className="h-8 w-8 mb-2" />
                <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Chemicals</h2>
          <div className="space-y-4">
            {chemicals.map((chemical) => (
              <button
                key={chemical.id}
                onClick={() => setSelectedChemical(chemical)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedChemical?.id === chemical.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-blue-50'
                }`}
              >
                <h3 className="font-semibold">{chemical.name}</h3>
                <div
                  className="w-6 h-6 rounded-full mt-2"
                  style={{ backgroundColor: chemical.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {selectedChemical && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Volume Control</h2>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full mb-2"
            />
            <div className="flex justify-between">
              <span>0 mL</span>
              <span>{volume} mL</span>
              <span>100 mL</span>
            </div>
            <button
              onClick={handlePour}
              disabled={!selectedContainer}
              className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Pour Chemical
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-gray-100 relative">
        <Canvas
          camera={{ position: [0, 5, 5] }}
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <LabTable
            containers={containers}
            onSelectContainer={setSelectedContainer}
            selectedContainer={selectedContainer}
          />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

// Helper functions for color mixing
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export default ChemistryLab;