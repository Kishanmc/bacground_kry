import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { LabContainer } from '../../types';

interface LabTableProps {
  containers: LabContainer[];
  onSelectContainer: (container: LabContainer) => void;
  selectedContainer: LabContainer | null;
}

const LabTable: React.FC<LabTableProps> = ({ 
  containers, 
  onSelectContainer, 
  selectedContainer 
}) => {
  const handleContainerClick = (event: ThreeEvent<MouseEvent>, container: LabContainer) => {
    event.stopPropagation();
    onSelectContainer(container);
  };

  return (
    <group>
      {/* Base table */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Table legs */}
      {[[-1.8, -2, -0.8], [1.8, -2, -0.8], [-1.8, -2, 0.8], [1.8, -2, 0.8]].map(
        (position, index) => (
          <mesh key={index} position={position} receiveShadow>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        )
      )}

      {/* Lab Containers */}
      {containers.map((container) => (
        <group
          key={container.id}
          position={container.position}
          onClick={(e) => handleContainerClick(e, container)}
        >
          {/* Container */}
          <mesh castShadow>
            <cylinderGeometry 
              args={[
                container.type === 'test_tube' ? 0.08 : 0.15,
                container.type === 'test_tube' ? 0.06 : 0.12,
                container.type === 'test_tube' ? 0.5 : 0.4,
                32
              ]} 
            />
            <meshStandardMaterial 
              color="#FFFFFF" 
              transparent 
              opacity={0.5}
              emissive={selectedContainer?.id === container.id ? "#404040" : "#000000"}
            />
          </mesh>

          {/* Chemical liquid */}
          {container.chemical && (
            <mesh 
              position={[0, -0.1, 0]}
              castShadow
            >
              <cylinderGeometry 
                args={[
                  container.type === 'test_tube' ? 0.07 : 0.14,
                  container.type === 'test_tube' ? 0.05 : 0.11,
                  (container.type === 'test_tube' ? 0.5 : 0.4) * 
                    (container.chemical.volume / container.maxVolume),
                  32
                ]} 
              />
              <meshStandardMaterial 
                color={container.chemical.color}
                transparent
                opacity={0.8}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

export default LabTable;