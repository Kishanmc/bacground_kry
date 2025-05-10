// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';

// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const DAMPING = 0.995; // Air resistance factor

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
//   setFrequency: (f: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
//   setFrequency,
// }) => {
//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Pendulum
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//         setFrequency={setFrequency}
//       />
//       <OrbitControls enablePan={false} />
//       <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
//     </>
//   );
// };

// const Pendulum: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
//   setFrequency,
// }) => {
//   const { camera } = useThree();
//   const bobRef = useRef<THREE.Mesh>(null);
//   const stringRef = useRef<THREE.Line>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [angle, setAngle] = useState(0);
//   const [angularVelocity, setAngularVelocity] = useState(0);

//   useEffect(() => {
//     setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
//     setFrequency(1 / (2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY)));
//   }, [setPeriod, setFrequency]);

//   useFrame(({ clock }) => {
//     if (bobRef.current && stringRef.current) {
//       const dt = 0.016; // Simulated fixed timestep

//       if (!isDragging) {
//         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle);
//         setAngularVelocity((prev) => prev * DAMPING + angularAcceleration * dt);
//         setAngle((prev) => prev + angularVelocity * dt);
//       }

//       const x = STRING_LENGTH * Math.sin(angle);
//       const y = -STRING_LENGTH * Math.cos(angle);

//       bobRef.current.position.set(x, y, 0);
//       setVelocity(angularVelocity * STRING_LENGTH);
//       setAcceleration((-GRAVITY * Math.sin(angle)));
//       setAmplitude(Math.abs(angle));

//       if (stringRef.current.geometry) {
//         const positions = new Float32Array([0, 0, 0, x, y, 0]);
//         stringRef.current.geometry.setAttribute(
//           'position',
//           new THREE.BufferAttribute(positions, 3)
//         );
//         stringRef.current.geometry.attributes.position.needsUpdate = true;
//       }
//     }
//   });

//   const handlePointerDown = () => setIsDragging(true);

//   const handlePointerMove = (e: any) => {
//     if (isDragging && bobRef.current) {
//       const mouse = new THREE.Vector2(
//         (e.clientX / window.innerWidth) * 2 - 1,
//         -(e.clientY / window.innerHeight) * 2 + 1
//       );
//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, camera);
//       const intersection = new THREE.Vector3();
//       raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);

//       // Check if the pointer is inside the ball (a simple distance check from the center of the ball)
//       const ballPosition = bobRef.current.position;
//       const distance = intersection.distanceTo(ballPosition);
//       if (distance > 0.2) { // Ball radius is 0.2, so only update angle if outside the ball
//         const newAngle = Math.atan2(intersection.x, intersection.y);
//         setAngle(newAngle);
//       }
//     }
//   };

//   const handlePointerUp = () => setIsDragging(false);

//   return (
//     <group>
//       <line ref={stringRef}>
//         <bufferGeometry />
//         <lineBasicMaterial color="white" />
//       </line>
//       <mesh
//         ref={bobRef}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//       >
//         <sphereGeometry args={[0.2]} />
//         <meshStandardMaterial color="red" />
//       </mesh>
//     </group>
//   );
// };

// const PhysicsLab = () => {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);
//   const [frequency, setFrequency] = useState(0);

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex">
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold">Amplitude</h3>
//             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold">Period</h3>
//             <p className="text-2xl">{period.toFixed(2)} s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold">Frequency</h3>
//             <p className="text-2xl">{frequency.toFixed(2)} Hz</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold">Velocity</h3>
//             <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-semibold">Acceleration</h3>
//             <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 bg-gray-900">
//         <Canvas>
//           <PendulumScene
//             setVelocity={setVelocity}
//             setAcceleration={setAcceleration}
//             setAmplitude={setAmplitude}
//             setPeriod={setPeriod}
//             setFrequency={setFrequency}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default PhysicsLab;

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Ruler, Timer, Gauge } from 'lucide-react';

const GRAVITY = 9.81;
const STRING_LENGTH = 3;
const DAMPING = 0.995; // Air resistance factor

interface PendulumSceneProps {
  setVelocity: (v: number) => void;
  setAcceleration: (a: number) => void;
  setAmplitude: (a: number) => void;
  setPeriod: (p: number) => void;
  setFrequency: (f: number) => void;
}

const PendulumScene: React.FC<PendulumSceneProps> = ({
  setVelocity,
  setAcceleration,
  setAmplitude,
  setPeriod,
  setFrequency,
}) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Pendulum
        setVelocity={setVelocity}
        setAcceleration={setAcceleration}
        setAmplitude={setAmplitude}
        setPeriod={setPeriod}
        setFrequency={setFrequency}
      />
      <OrbitControls enablePan={false} />
      <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
};

const Pendulum: React.FC<PendulumSceneProps> = ({
  setVelocity,
  setAcceleration,
  setAmplitude,
  setPeriod,
  setFrequency,
}) => {
  const { camera } = useThree();
  const bobRef = useRef<THREE.Mesh>(null);
  const stringRef = useRef<THREE.Line>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0);

  useEffect(() => {
    setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
    setFrequency(1 / (2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY)));
  }, [setPeriod, setFrequency]);

  useFrame(({ clock }) => {
    if (bobRef.current && stringRef.current) {
      const dt = 0.016; // Simulated fixed timestep

      if (!isDragging) {
        const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle);
        setAngularVelocity((prev) => prev * DAMPING + angularAcceleration * dt);
        setAngle((prev) => prev + angularVelocity * dt);
      }

      const x = STRING_LENGTH * Math.sin(angle);
      const y = -STRING_LENGTH * Math.cos(angle);

      bobRef.current.position.set(x, y, 0);
      setVelocity(angularVelocity * STRING_LENGTH);
      setAcceleration((-GRAVITY * Math.sin(angle)));
      setAmplitude(Math.abs(angle));

      if (stringRef.current.geometry) {
        const positions = new Float32Array([0, 0, 0, x, y, 0]);
        stringRef.current.geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        stringRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerMove = (e: any) => {
    if (isDragging) {
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);
      const newAngle = Math.atan2(intersection.x, intersection.y);
      setAngle(newAngle);
    }
  };
  const handlePointerUp = () => setIsDragging(false);

  return (
    <group>
      <line ref={stringRef}>
        <bufferGeometry />
        <lineBasicMaterial color="white" />
      </line>
      <mesh
        ref={bobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
};

const PhysicsLab = () => {
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [amplitude, setAmplitude] = useState(0);
  const [period, setPeriod] = useState(0);
  const [frequency, setFrequency] = useState(0);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Amplitude</h3>
            <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Period</h3>
            <p className="text-2xl">{period.toFixed(2)} s</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Frequency</h3>
            <p className="text-2xl">{frequency.toFixed(2)} Hz</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Velocity</h3>
            <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Acceleration</h3>
            <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-gray-900">
        <Canvas>
          <PendulumScene
            setVelocity={setVelocity}
            setAcceleration={setAcceleration}
            setAmplitude={setAmplitude}
            setPeriod={setPeriod}
            setFrequency={setFrequency}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default PhysicsLab;
// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';
// import { Ruler, Timer, Gauge } from 'lucide-react';

// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const AIR_RESISTANCE = 0.01;

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
//   setFrequency: (f: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
//   setFrequency,
// }) => {
//   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
//   const [isDragging, setIsDragging] = useState(false);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />

//       <mesh position={[0, 0, 0]}>
//         <sphereGeometry args={[0.1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       <Pendulum
//         position={bobPosition}
//         onDrag={setBobPosition}
//         isDragging={isDragging}
//         setIsDragging={setIsDragging}
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//         setFrequency={setFrequency}
//       />

//       <OrbitControls enablePan={false} />
//     </>
//   );
// };

// interface PendulumProps {
//   position: THREE.Vector3;
//   onDrag: (position: THREE.Vector3) => void;
//   isDragging: boolean;
//   setIsDragging: (dragging: boolean) => void;
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
//   setFrequency: (f: number) => void;
// }

// const Pendulum: React.FC<PendulumProps> = ({
//   position,
//   onDrag,
//   isDragging,
//   setIsDragging,
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
//   setFrequency,
// }) => {
//   const { camera } = useThree();
//   const bobRef = useRef<THREE.Mesh>(null);
//   const stringRef = useRef<THREE.Line>(null);
//   const lastTime = useRef(Date.now());
//   const velocity = useRef(0);
//   const angle = useRef(0);
//   const damping = 1 - AIR_RESISTANCE;
//   const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
//   const intersection = new THREE.Vector3();

//   useEffect(() => {
//     if (!isDragging) {
//       const currentAngle = Math.atan2(position.x, -position.y);
//       angle.current = currentAngle;
//       setAmplitude(Math.abs(currentAngle));
//       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
//       setFrequency(1 / (2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY)));
//     }
//   }, [isDragging, position, setAmplitude, setPeriod, setFrequency]);

//   useFrame(() => {
//     if (bobRef.current && stringRef.current) {
//       const stringGeometry = stringRef.current.geometry as THREE.BufferGeometry;
//       const positions = new Float32Array([
//         0, 0, 0,
//         position.x, position.y, position.z,
//       ]);
//       stringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       stringGeometry.attributes.position.needsUpdate = true;
//       bobRef.current.position.copy(position);

//       if (!isDragging) {
//         const currentTime = Date.now();
//         const deltaTime = (currentTime - lastTime.current) / 1000;
//         lastTime.current = currentTime;

//         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle.current);
//         velocity.current = (velocity.current + angularAcceleration * deltaTime) * damping;
//         angle.current += velocity.current * deltaTime;

//         const newX = STRING_LENGTH * Math.sin(angle.current);
//         const newY = -STRING_LENGTH * Math.cos(angle.current);
//         onDrag(new THREE.Vector3(newX, newY, 0));

//         setVelocity(velocity.current * STRING_LENGTH);
//         setAcceleration(angularAcceleration * STRING_LENGTH);
//       }
//     }
//   });

//   return (
//     <group>
//       <line ref={stringRef}>
//         <bufferGeometry />
//         <lineBasicMaterial color="white" />
//       </line>

//       <mesh ref={bobRef} onPointerDown={() => setIsDragging(true)}>
//         <sphereGeometry args={[0.2]} />
//         <meshStandardMaterial color="red" />
//       </mesh>
//     </group>
//   );
// };

// const PhysicsLab = () => {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);
//   const [frequency, setFrequency] = useState(0);

//   return (
//     <div className="min-h-screen flex">
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
//         <p>Amplitude: {(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
//         <p>Period: {period.toFixed(2)} s</p>
//         <p>Frequency: {frequency.toFixed(2)} Hz</p>
//         <p>Velocity: {velocity.toFixed(2)} m/s</p>
//         <p>Acceleration: {acceleration.toFixed(2)} m/s²</p>
//       </div>
//       <div className="flex-1 bg-gray-900">
//         <Canvas>
//           <PendulumScene
//             setVelocity={setVelocity}
//             setAcceleration={setAcceleration}
//             setAmplitude={setAmplitude}
//             setPeriod={setPeriod}
//             setFrequency={setFrequency}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default PhysicsLab;

// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';
// import { Ruler, Timer, Gauge } from 'lucide-react';

// // Constants for physics calculations
// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const AIR_RESISTANCE = 0.01;

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
// }) => {
//   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
//   const [isDragging, setIsDragging] = useState(false);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 2, 8]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />

//       {/* Pivot point */}
//       <mesh position={[0, 0, 0]}>
//         <sphereGeometry args={[0.1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       <Pendulum
//         position={bobPosition}
//         onDrag={setBobPosition}
//         isDragging={isDragging}
//         setIsDragging={setIsDragging}
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//       />

//       <OrbitControls />
//     </>
//   );
// };

// interface PendulumProps {
//   position: THREE.Vector3;
//   onDrag: (position: THREE.Vector3) => void;
//   isDragging: boolean;
//   setIsDragging: (dragging: boolean) => void;
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const Pendulum: React.FC<PendulumProps> = ({
//   position,
//   onDrag,
//   isDragging,
//   setIsDragging,
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod,
// }) => {
//   const { camera } = useThree();
//   const bobRef = useRef<THREE.Mesh>(null);
//   const stringRef = useRef<THREE.Line>(null);
//   const lastTime = useRef(Date.now());
//   const angleRef = useRef(0);
//   const velocityRef = useRef(0);

//   useEffect(() => {
//     if (!isDragging) {
//       angleRef.current = Math.atan2(position.x, -position.y);
//       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
//       setAmplitude(Math.abs(angleRef.current));
//     }
//   }, [isDragging, position, setPeriod, setAmplitude]);

//   useFrame(() => {
//     if (bobRef.current && stringRef.current) {
//       const stringGeometry = stringRef.current.geometry as THREE.BufferGeometry;
//       const positions = new Float32Array([
//         0, 0, 0,
//         position.x, position.y, position.z,
//       ]);
//       stringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       stringGeometry.attributes.position.needsUpdate = true;

//       bobRef.current.position.copy(position);

//       if (!isDragging) {
//         const currentTime = Date.now();
//         const deltaTime = (currentTime - lastTime.current) / 1000;
//         lastTime.current = currentTime;

//         const angle = angleRef.current;
//         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle);
//         velocityRef.current += angularAcceleration * deltaTime;
//         velocityRef.current *= (1 - AIR_RESISTANCE);

//         setAcceleration(angularAcceleration * STRING_LENGTH);
//         setVelocity(velocityRef.current * STRING_LENGTH);

//         angleRef.current += velocityRef.current * deltaTime;
//         const newX = STRING_LENGTH * Math.sin(angleRef.current);
//         const newY = -STRING_LENGTH * Math.cos(angleRef.current);

//         onDrag(new THREE.Vector3(newX, newY, 0));
//       }
//     }
//   });

//   const handlePointerDown = (e: THREE.Event) => {
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handlePointerMove = (e: THREE.Event) => {
//     if (isDragging && bobRef.current) {
//       e.stopPropagation();
//       const mouse = new THREE.Vector2(
//         (e.clientX / window.innerWidth) * 2 - 1,
//         -(e.clientY / window.innerHeight) * 2 + 1
//       );
//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, camera);
//       const intersection = new THREE.Vector3();
//       raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);
      
//       const angle = Math.atan2(intersection.x, -intersection.y);
//       const newX = STRING_LENGTH * Math.sin(angle);
//       const newY = -STRING_LENGTH * Math.cos(angle);
      
//       onDrag(new THREE.Vector3(newX, newY, 0));
//     }
//   };

//   const handlePointerUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <group>
//       {/* String */}
//       <line ref={stringRef}>
//         <bufferGeometry />
//         <lineBasicMaterial color="white" linewidth={2} />
//       </line>

//       {/* Bob */}
//       <mesh
//         ref={bobRef}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//       >
//         <sphereGeometry args={[0.2]} />
//         <meshStandardMaterial color="red" />
//       </mesh>
//     </group>
//   );
// };

// export default function PhysicsLab() {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);

//   return (
//     <Canvas>
//       <PendulumScene
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//       />
//     </Canvas>
//   );
// }


// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';
// import { Ruler, Timer, Gauge } from 'lucide-react';

// // Constants for physics calculations
// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const AIR_FRICTION = 0.002; // Added air resistance for realistic slow down

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod
// }) => {
//   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
//   const [isDragging, setIsDragging] = useState(false);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 2, 6]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />

//       {/* Pivot point */}
//       <mesh position={[0, 0, 0]}>
//         <sphereGeometry args={[0.1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       {/* String */}
//       <line>
//         <bufferGeometry>
//           <float32BufferAttribute attach="attributes-position" array={new Float32Array([0, 0, 0, bobPosition.x, bobPosition.y, bobPosition.z])} itemSize={3} />
//         </bufferGeometry>
//         <lineBasicMaterial color="white" linewidth={2} />
//       </line>

//       <Pendulum
//         position={bobPosition}
//         onDrag={setBobPosition}
//         isDragging={isDragging}
//         setIsDragging={setIsDragging}
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//       />

//       <OrbitControls enablePan={false} />
//       <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
//     </>
//   );
// };

// interface PendulumProps {
//   position: THREE.Vector3;
//   onDrag: (position: THREE.Vector3) => void;
//   isDragging: boolean;
//   setIsDragging: (dragging: boolean) => void;
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const Pendulum: React.FC<PendulumProps> = ({
//   position,
//   onDrag,
//   isDragging,
//   setIsDragging,
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod
// }) => {
//   const { camera } = useThree();
//   const bobRef = useRef<THREE.Mesh>(null);
//   const lastTime = useRef(Date.now());
//   const angleRef = useRef(0);
//   const velocityRef = useRef(0);

//   useEffect(() => {
//     if (!isDragging) {
//       const angle = Math.atan2(position.x, -position.y);
//       angleRef.current = angle;
//       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
//       setAmplitude(Math.abs(angle));
//     }
//   }, [isDragging, position, setPeriod, setAmplitude]);

//   useFrame(() => {
//     if (bobRef.current) {
//       if (!isDragging) {
//         const currentTime = Date.now();
//         const deltaTime = (currentTime - lastTime.current) / 1000;
//         lastTime.current = currentTime;

//         const angle = angleRef.current;
//         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle);
//         velocityRef.current += angularAcceleration * deltaTime;
//         velocityRef.current *= (1 - AIR_FRICTION);

//         angleRef.current += velocityRef.current * deltaTime;

//         const newX = STRING_LENGTH * Math.sin(angleRef.current);
//         const newY = -STRING_LENGTH * Math.cos(angleRef.current);
//         onDrag(new THREE.Vector3(newX, newY, 0));

//         setAcceleration(angularAcceleration * STRING_LENGTH);
//         setVelocity(velocityRef.current * STRING_LENGTH);
//       }
//     }
//   });

//   return (
//     <mesh ref={bobRef} position={position}>
//       <sphereGeometry args={[0.2]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//   );
// };

// const PhysicsLab = () => {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);

//   return (
//     <div className="min-h-screen flex">
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <Ruler className="w-5 h-5 mr-2 text-blue-600" />
//             <h3 className="font-semibold">Amplitude</h3>
//             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <Timer className="w-5 h-5 mr-2 text-blue-600" />
//             <h3 className="font-semibold">Period</h3>
//             <p className="text-2xl">{period.toFixed(2)} s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//             <h3 className="font-semibold">Velocity</h3>
//             <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//             <h3 className="font-semibold">Acceleration</h3>
//             <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 bg-gray-900">
//         <Canvas>
//           <PendulumScene
//             setVelocity={setVelocity}
//             setAcceleration={setAcceleration}
//             setAmplitude={setAmplitude}
//             setPeriod={setPeriod}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default PhysicsLab;

// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';
// import { Ruler, Timer, Gauge } from 'lucide-react';

// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const DAMPING = 0.995; // Air resistance factor

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod
// }) => {
//   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
//   const [isDragging, setIsDragging] = useState(false);
//   const [angle, setAngle] = useState(0);
//   const [angularVelocity, setAngularVelocity] = useState(0);

//   useFrame((_, delta) => {
//     if (!isDragging) {
//       const angularAcceleration = -GRAVITY / STRING_LENGTH * Math.sin(angle);
//       const newAngularVelocity = (angularVelocity + angularAcceleration * delta) * DAMPING;
//       const newAngle = angle + newAngularVelocity * delta;

//       setAngularVelocity(newAngularVelocity);
//       setAngle(newAngle);
//       setVelocity(newAngularVelocity * STRING_LENGTH);
//       setAcceleration(angularAcceleration * STRING_LENGTH);
//       setAmplitude(Math.abs(newAngle));
//       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));

//       setBobPosition(new THREE.Vector3(
//         STRING_LENGTH * Math.sin(newAngle),
//         -STRING_LENGTH * Math.cos(newAngle),
//         0
//       ));
//     }
//   });

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />
//       <Pendulum
//         position={bobPosition}
//         setIsDragging={setIsDragging}
//         setAngle={setAngle}
//         setAngularVelocity={setAngularVelocity}
//       />
//       <OrbitControls />
//     </>
//   );
// };

// interface PendulumProps {
//   position: THREE.Vector3;
//   setIsDragging: (dragging: boolean) => void;
//   setAngle: (a: number) => void;
//   setAngularVelocity: (v: number) => void;
// }

// const Pendulum: React.FC<PendulumProps> = ({
//   position,
//   setIsDragging,
//   setAngle,
//   setAngularVelocity
// }) => {
//   const bobRef = useRef<THREE.Mesh>(null);

//   const handlePointerDown = () => setIsDragging(true);
//   const handlePointerMove = (e: THREE.PointerEvent) => {
//     if (!bobRef.current) return;
//     const newX = (e.clientX / window.innerWidth) * 2 - 1;
//     setAngle(Math.asin(newX / STRING_LENGTH));
//   };
//   const handlePointerUp = () => {
//     setIsDragging(false);
//     setAngularVelocity(0);
//   };

//   return (
//     <mesh
//       ref={bobRef}
//       position={position.toArray()}
//       onPointerDown={handlePointerDown}
//       onPointerMove={handlePointerMove}
//       onPointerUp={handlePointerUp}
//     >
//       <sphereGeometry args={[0.2]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//   );
// };

// const PhysicsLab = () => {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Ruler className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Amplitude</h3>
//             </div>
//             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Timer className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Period</h3>
//             </div>
//             <p className="text-2xl">{period.toFixed(2)} s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Velocity</h3>
//             </div>
//             <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
//           </div>
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Acceleration</h3>
//             </div>
//             <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 bg-gray-900">
//         <Canvas>
//           <PendulumScene
//             setVelocity={setVelocity}
//             setAcceleration={setAcceleration}
//             setAmplitude={setAmplitude}
//             setPeriod={setPeriod}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default PhysicsLab;

// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import * as THREE from 'three';
// import { Ruler, Timer, Gauge } from 'lucide-react';

// // Constants for physics calculations
// const GRAVITY = 9.81;
// const STRING_LENGTH = 3;
// const DAMPING = 0.99; // Damping factor to gradually stop the pendulum

// interface PendulumSceneProps {
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const PendulumScene: React.FC<PendulumSceneProps> = ({
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod
// }) => {
//   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
//   const [isDragging, setIsDragging] = useState(false);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />

//       {/* Pivot point */}
//       <mesh position={[0, 0, 0]}>
//         <sphereGeometry args={[0.1]} />
//         <meshStandardMaterial color="white" />
//       </mesh>

//       <Pendulum
//         position={bobPosition}
//         onDrag={setBobPosition}
//         isDragging={isDragging}
//         setIsDragging={setIsDragging}
//         setVelocity={setVelocity}
//         setAcceleration={setAcceleration}
//         setAmplitude={setAmplitude}
//         setPeriod={setPeriod}
//       />

//       <OrbitControls enablePan={false} />

//       {/* Grid for reference */}
//       <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
//     </>
//   );
// };

// interface PendulumProps {
//   position: THREE.Vector3;
//   onDrag: (position: THREE.Vector3) => void;
//   isDragging: boolean;
//   setIsDragging: (dragging: boolean) => void;
//   setVelocity: (v: number) => void;
//   setAcceleration: (a: number) => void;
//   setAmplitude: (a: number) => void;
//   setPeriod: (p: number) => void;
// }

// const Pendulum: React.FC<PendulumProps> = ({
//   position,
//   onDrag,
//   isDragging,
//   setIsDragging,
//   setVelocity,
//   setAcceleration,
//   setAmplitude,
//   setPeriod
// }) => {
//   const { camera } = useThree();
//   const bobRef = useRef<THREE.Mesh>(null);
//   const stringRef = useRef<THREE.Line>(null);
//   const lastTime = useRef(performance.now());
//   const angleRef = useRef(Math.atan2(position.x, -position.y)); // Store angle
//   const angularVelocity = useRef(0);
  
//   useEffect(() => {
//     if (!isDragging) {
//       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
//       setAmplitude(Math.abs(angleRef.current));
//     }
//   }, [isDragging, setPeriod, setAmplitude]);

//   useFrame(() => {
//     if (bobRef.current && stringRef.current) {
//       const now = performance.now();
//       const deltaTime = (now - lastTime.current) / 1000;
//       lastTime.current = now;

//       if (!isDragging) {
//         // Simple harmonic motion with damping
//         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angleRef.current);
//         angularVelocity.current += angularAcceleration * deltaTime;
//         angularVelocity.current *= DAMPING; // Apply damping to slow down the pendulum
//         angleRef.current += angularVelocity.current * deltaTime;

//         const newX = STRING_LENGTH * Math.sin(angleRef.current);
//         const newY = -STRING_LENGTH * Math.cos(angleRef.current);

//         onDrag(new THREE.Vector3(newX, newY, 0));

//         // Update physics values
//         setVelocity(angularVelocity.current * STRING_LENGTH);
//         setAcceleration(angularAcceleration * STRING_LENGTH);
//       }

//       // Update string geometry
//       const stringGeometry = stringRef.current.geometry as THREE.BufferGeometry;
//       const positions = new Float32Array([0, 0, 0, position.x, position.y, position.z]);
//       stringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       stringGeometry.attributes.position.needsUpdate = true;

//       bobRef.current.position.copy(position);
//     }
//   });

//   const handlePointerDown = (e: THREE.PointerEvent) => {
//     e.stopPropagation();
//     setIsDragging(true);
//     angularVelocity.current = 0; // Stop motion while dragging
//   };

//   const handlePointerMove = (e: THREE.PointerEvent) => {
//     if (isDragging && bobRef.current) {
//       e.stopPropagation();
//       const mouse = new THREE.Vector2(
//         (e.clientX / window.innerWidth) * 2 - 1,
//         -(e.clientY / window.innerHeight) * 2 + 1
//       );
//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, camera);

//       const intersection = new THREE.Vector3();
//       const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
//       raycaster.ray.intersectPlane(dragPlane, intersection);

//       const angle = Math.atan2(intersection.x, -intersection.y);
//       angleRef.current = angle;
//       const newX = STRING_LENGTH * Math.sin(angle);
//       const newY = -STRING_LENGTH * Math.cos(angle);

//       onDrag(new THREE.Vector3(newX, newY, 0));
//     }
//   };

//   const handlePointerUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <group>
//       {/* String */}
//       <line ref={stringRef}>
//         <bufferGeometry />
//         <lineBasicMaterial color="white" />
//       </line>

//       {/* Bob */}
//       <mesh
//         ref={bobRef}
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//       >
//         <sphereGeometry args={[0.2]} />
//         <meshStandardMaterial color="red" />
//       </mesh>
//     </group>
//   );
// };

// const PhysicsLab = () => {
//   const [velocity, setVelocity] = useState(0);
//   const [acceleration, setAcceleration] = useState(0);
//   const [amplitude, setAmplitude] = useState(0);
//   const [period, setPeriod] = useState(0);

//   return (
//     <div className="min-h-[calc(100vh-4rem)] flex">
//       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Ruler className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Amplitude</h3>
//             </div>
//             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Timer className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Period</h3>
//             </div>
//             <p className="text-2xl">{period.toFixed(2)} s</p>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Velocity</h3>
//             </div>
//             <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <div className="flex items-center mb-2">
//               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
//               <h3 className="font-semibold">Acceleration</h3>
//             </div>
//             <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 bg-gray-900">
//         <Canvas>
//           <PendulumScene
//             setVelocity={setVelocity}
//             setAcceleration={setAcceleration}
//             setAmplitude={setAmplitude}
//             setPeriod={setPeriod}
//           />
//         </Canvas>
//       </div>
//     </div>
//   );
// };

// export default PhysicsLab;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Canvas, useThree, useFrame } from '@react-three/fiber';
// // import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// // import * as THREE from 'three';
// // import { Ruler, Timer, Gauge } from 'lucide-react';

// // // Constants for physics calculations
// // const GRAVITY = 9.81;
// // const STRING_LENGTH = 3;

// // interface PendulumSceneProps {
// //   setVelocity: (v: number) => void;
// //   setAcceleration: (a: number) => void;
// //   setAmplitude: (a: number) => void;
// //   setPeriod: (p: number) => void;
// // }

// // const PendulumScene: React.FC<PendulumSceneProps> = ({
// //   setVelocity,
// //   setAcceleration,
// //   setAmplitude,
// //   setPeriod
// // }) => {
// //   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, -STRING_LENGTH, 0));
// //   const [isDragging, setIsDragging] = useState(false);

// //   return (
// //     <>
// //       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
// //       <ambientLight intensity={0.5} />
// //       <pointLight position={[10, 10, 10]} />

// //       {/* Pivot point */}
// //       <mesh position={[0, 0, 0]}>
// //         <sphereGeometry args={[0.1]} />
// //         <meshStandardMaterial color="white" />
// //       </mesh>

// //       <Pendulum
// //         position={bobPosition}
// //         onDrag={setBobPosition}
// //         isDragging={isDragging}
// //         setIsDragging={setIsDragging}
// //         setVelocity={setVelocity}
// //         setAcceleration={setAcceleration}
// //         setAmplitude={setAmplitude}
// //         setPeriod={setPeriod}
// //       />

// //       <OrbitControls enablePan={false} />

// //       {/* Grid for reference */}
// //       <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
// //     </>
// //   );
// // };

// // interface PendulumProps {
// //   position: THREE.Vector3;
// //   onDrag: (position: THREE.Vector3) => void;
// //   isDragging: boolean;
// //   setIsDragging: (dragging: boolean) => void;
// //   setVelocity: (v: number) => void;
// //   setAcceleration: (a: number) => void;
// //   setAmplitude: (a: number) => void;
// //   setPeriod: (p: number) => void;
// // }

// // const Pendulum: React.FC<PendulumProps> = ({
// //   position,
// //   onDrag,
// //   isDragging,
// //   setIsDragging,
// //   setVelocity,
// //   setAcceleration,
// //   setAmplitude,
// //   setPeriod
// // }) => {
// //   const { camera } = useThree();
// //   const bobRef = useRef<THREE.Mesh>(null);
// //   const stringRef = useRef<THREE.Line>(null);
// //   const lastTime = useRef(performance.now());
// //   const angleRef = useRef(Math.atan2(position.x, -position.y)); // Store angle
// //   const angularVelocity = useRef(0);
  
// //   useEffect(() => {
// //     if (!isDragging) {
// //       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
// //       setAmplitude(Math.abs(angleRef.current));
// //     }
// //   }, [isDragging, setPeriod, setAmplitude]);

// //   useFrame(() => {
// //     if (bobRef.current && stringRef.current) {
// //       const now = performance.now();
// //       const deltaTime = (now - lastTime.current) / 1000;
// //       lastTime.current = now;

// //       if (!isDragging) {
// //         // Simple harmonic motion equation
// //         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angleRef.current);
// //         angularVelocity.current += angularAcceleration * deltaTime;
// //         angleRef.current += angularVelocity.current * deltaTime;

// //         const newX = STRING_LENGTH * Math.sin(angleRef.current);
// //         const newY = -STRING_LENGTH * Math.cos(angleRef.current);

// //         onDrag(new THREE.Vector3(newX, newY, 0));

// //         // Update physics values
// //         setVelocity(angularVelocity.current * STRING_LENGTH);
// //         setAcceleration(angularAcceleration * STRING_LENGTH);
// //       }

// //       // Update string geometry
// //       const stringGeometry = stringRef.current.geometry as THREE.BufferGeometry;
// //       const positions = new Float32Array([
// //         0, 0, 0,
// //         position.x, position.y, position.z
// //       ]);
// //       stringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// //       stringGeometry.attributes.position.needsUpdate = true;

// //       bobRef.current.position.copy(position);
// //     }
// //   });

// //   const handlePointerDown = (e: THREE.PointerEvent) => {
// //     e.stopPropagation();
// //     setIsDragging(true);
// //     angularVelocity.current = 0; // Stop motion while dragging
// //   };

// //   const handlePointerMove = (e: THREE.PointerEvent) => {
// //     if (isDragging && bobRef.current) {
// //       e.stopPropagation();
// //       const mouse = new THREE.Vector2(
// //         (e.clientX / window.innerWidth) * 2 - 1,
// //         -(e.clientY / window.innerHeight) * 2 + 1
// //       );
// //       const raycaster = new THREE.Raycaster();
// //       raycaster.setFromCamera(mouse, camera);

// //       const intersection = new THREE.Vector3();
// //       const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
// //       raycaster.ray.intersectPlane(dragPlane, intersection);

// //       const angle = Math.atan2(intersection.x, -intersection.y);
// //       angleRef.current = angle;
// //       const newX = STRING_LENGTH * Math.sin(angle);
// //       const newY = -STRING_LENGTH * Math.cos(angle);

// //       onDrag(new THREE.Vector3(newX, newY, 0));
// //     }
// //   };

// //   const handlePointerUp = () => {
// //     setIsDragging(false);
// //   };

// //   return (
// //     <group>
// //       {/* String */}
// //       <line ref={stringRef}>
// //         <bufferGeometry />
// //         <lineBasicMaterial color="white" />
// //       </line>

// //       {/* Bob */}
// //       <mesh
// //         ref={bobRef}
// //         onPointerDown={handlePointerDown}
// //         onPointerMove={handlePointerMove}
// //         onPointerUp={handlePointerUp}
// //       >
// //         <sphereGeometry args={[0.2]} />
// //         <meshStandardMaterial color="red" />
// //       </mesh>
// //     </group>
// //   );
// // };

// // const PhysicsLab = () => {
// //   const [velocity, setVelocity] = useState(0);
// //   const [acceleration, setAcceleration] = useState(0);
// //   const [amplitude, setAmplitude] = useState(0);
// //   const [period, setPeriod] = useState(0);

// //   return (
// //     <div className="min-h-[calc(100vh-4rem)] flex">
// //       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
// //         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
// //         <div className="space-y-6">
// //           <div className="bg-gray-50 p-4 rounded-lg">
// //             <div className="flex items-center mb-2">
// //               <Ruler className="w-5 h-5 mr-2 text-blue-600" />
// //               <h3 className="font-semibold">Amplitude</h3>
// //             </div>
// //             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="flex-1 bg-gray-900">
// //         <Canvas>
// //           <PendulumScene
// //             setVelocity={setVelocity}
// //             setAcceleration={setAcceleration}
// //             setAmplitude={setAmplitude}
// //             setPeriod={setPeriod}
// //           />
// //         </Canvas>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PhysicsLab;
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { Canvas, useThree, useFrame } from '@react-three/fiber';
// // // import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// // // import * as THREE from 'three';
// // // import { Ruler, Timer, Gauge } from 'lucide-react';

// // // // Constants for physics calculations
// // // const GRAVITY = 9.81;
// // // const STRING_LENGTH = 3;

// // // interface PendulumSceneProps {
// // //   setVelocity: (v: number) => void;
// // //   setAcceleration: (a: number) => void;
// // //   setAmplitude: (a: number) => void;
// // //   setPeriod: (p: number) => void;
// // // }

// // // const PendulumScene: React.FC<PendulumSceneProps> = ({
// // //   setVelocity,
// // //   setAcceleration,
// // //   setAmplitude,
// // //   setPeriod
// // // }) => {
// // //   const [bobPosition, setBobPosition] = useState(new THREE.Vector3(0, STRING_LENGTH, 0));
// // //   const [isDragging, setIsDragging] = useState(false);

// // //   return (
// // //     <>
// // //       <PerspectiveCamera makeDefault position={[0, 0, 10]} />
// // //       <ambientLight intensity={0.5} />
// // //       <pointLight position={[10, 10, 10]} />
      
// // //       {/* Pivot point */}
// // //       <mesh position={[0, STRING_LENGTH, 0]}>
// // //         <sphereGeometry args={[0.1]} />
// // //         <meshStandardMaterial color="white" />
// // //       </mesh>

// // //       <Pendulum
// // //         position={bobPosition}
// // //         onDrag={setBobPosition}
// // //         isDragging={isDragging}
// // //         setIsDragging={setIsDragging}
// // //         setVelocity={setVelocity}
// // //         setAcceleration={setAcceleration}
// // //         setAmplitude={setAmplitude}
// // //         setPeriod={setPeriod}
// // //       />

// // //       <OrbitControls enablePan={false} />

// // //       {/* Grid for reference */}
// // //       <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
// // //     </>
// // //   );
// // // };

// // // interface PendulumProps {
// // //   position: THREE.Vector3;
// // //   onDrag: (position: THREE.Vector3) => void;
// // //   isDragging: boolean;
// // //   setIsDragging: (dragging: boolean) => void;
// // //   setVelocity: (v: number) => void;
// // //   setAcceleration: (a: number) => void;
// // //   setAmplitude: (a: number) => void;
// // //   setPeriod: (p: number) => void;
// // // }

// // // const Pendulum: React.FC<PendulumProps> = ({
// // //   position,
// // //   onDrag,
// // //   isDragging,
// // //   setIsDragging,
// // //   setVelocity,
// // //   setAcceleration,
// // //   setAmplitude,
// // //   setPeriod
// // // }) => {
// // //   const { camera } = useThree();
// // //   const bobRef = useRef<THREE.Mesh>(null);
// // //   const stringRef = useRef<THREE.Line>(null);
// // //   const lastTime = useRef(Date.now());
// // //   const startAngle = useRef(0);
// // //   const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
// // //   const intersection = new THREE.Vector3();

// // //   useEffect(() => {
// // //     if (!isDragging) {
// // //       const angle = Math.atan2(position.x, position.y);
// // //       startAngle.current = angle;
// // //       setPeriod(2 * Math.PI * Math.sqrt(STRING_LENGTH / GRAVITY));
// // //       setAmplitude(Math.abs(angle));
// // //     }
// // //   }, [isDragging, position, setPeriod, setAmplitude]);

// // //   useFrame(() => {
// // //     if (bobRef.current && stringRef.current) {
// // //       // Update string geometry to follow bob
// // //       const stringGeometry = stringRef.current.geometry as THREE.BufferGeometry;
// // //       const positions = new Float32Array([
// // //         0, STRING_LENGTH, 0,
// // //         position.x, position.y, position.z
// // //       ]);
// // //       stringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// // //       stringGeometry.attributes.position.needsUpdate = true;

// // //       // Update bob position
// // //       bobRef.current.position.copy(position);

// // //       if (!isDragging) {
// // //         const currentTime = Date.now();
// // //         const deltaTime = (currentTime - lastTime.current) / 1000;
// // //         lastTime.current = currentTime;

// // //         const angle = Math.atan2(position.x, position.y);
// // //         const angularAcceleration = -(GRAVITY / STRING_LENGTH) * Math.sin(angle);
        
// // //         setAcceleration(angularAcceleration * STRING_LENGTH);
// // //         setVelocity(angularAcceleration * deltaTime * STRING_LENGTH);

// // //         const newAngle = angle + angularAcceleration * deltaTime;
// // //         const newX = STRING_LENGTH * Math.sin(newAngle);
// // //         const newY = STRING_LENGTH * Math.cos(newAngle);
        
// // //         onDrag(new THREE.Vector3(newX, newY, 0));
// // //       }
// // //     }
// // //   });

// // //   const handlePointerDown = (e: THREE.Event) => {
// // //     e.stopPropagation();
// // //     setIsDragging(true);
// // //   };

// // //   const handlePointerMove = (e: THREE.Event) => {
// // //     if (isDragging && bobRef.current) {
// // //       e.stopPropagation();
// // //       const mouse = new THREE.Vector2(
// // //         (e.clientX / window.innerWidth) * 2 - 1,
// // //         -(e.clientY / window.innerHeight) * 2 + 1
// // //       );
// // //       const raycaster = new THREE.Raycaster();
// // //       raycaster.setFromCamera(mouse, camera);
// // //       raycaster.ray.intersectPlane(dragPlane, intersection);

// // //       // Constrain movement to circular arc
// // //       const radius = STRING_LENGTH;
// // //       const angle = Math.atan2(intersection.x, intersection.y);
// // //       const newX = radius * Math.sin(angle);
// // //       const newY = radius * Math.cos(angle);
      
// // //       onDrag(new THREE.Vector3(newX, newY, 0));
// // //     }
// // //   };

// // //   const handlePointerUp = () => {
// // //     setIsDragging(false);
// // //   };

// // //   return (
// // //     <group>
// // //       {/* String */}
// // //       <line ref={stringRef}>
// // //         <bufferGeometry />
// // //         <lineBasicMaterial color="white" />
// // //       </line>

// // //       {/* Bob */}
// // //       <mesh
// // //         ref={bobRef}
// // //         onPointerDown={handlePointerDown}
// // //         onPointerMove={handlePointerMove}
// // //         onPointerUp={handlePointerUp}
// // //       >
// // //         <sphereGeometry args={[0.2]} />
// // //         <meshStandardMaterial color="red" />
// // //       </mesh>
// // //     </group>
// // //   );
// // // };

// // // const PhysicsLab = () => {
// // //   const [velocity, setVelocity] = useState(0);
// // //   const [acceleration, setAcceleration] = useState(0);
// // //   const [amplitude, setAmplitude] = useState(0);
// // //   const [period, setPeriod] = useState(0);

// // //   return (
// // //     <div className="min-h-[calc(100vh-4rem)] flex">
// // //       <div className="w-1/4 bg-white p-6 shadow-lg overflow-y-auto">
// // //         <h2 className="text-2xl font-bold mb-6">Pendulum Motion</h2>
        
// // //         <div className="space-y-6">
// // //           <div className="bg-gray-50 p-4 rounded-lg">
// // //             <div className="flex items-center mb-2">
// // //               <Ruler className="w-5 h-5 mr-2 text-blue-600" />
// // //               <h3 className="font-semibold">Amplitude</h3>
// // //             </div>
// // //             <p className="text-2xl">{(amplitude * (180 / Math.PI)).toFixed(2)}°</p>
// // //           </div>

// // //           <div className="bg-gray-50 p-4 rounded-lg">
// // //             <div className="flex items-center mb-2">
// // //               <Timer className="w-5 h-5 mr-2 text-blue-600" />
// // //               <h3 className="font-semibold">Period</h3>
// // //             </div>
// // //             <p className="text-2xl">{period.toFixed(2)} s</p>
// // //           </div>

// // //           <div className="bg-gray-50 p-4 rounded-lg">
// // //             <div className="flex items-center mb-2">
// // //               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
// // //               <h3 className="font-semibold">Velocity</h3>
// // //             </div>
// // //             <p className="text-2xl">{velocity.toFixed(2)} m/s</p>
// // //           </div>

// // //           <div className="bg-gray-50 p-4 rounded-lg">
// // //             <div className="flex items-center mb-2">
// // //               <Gauge className="w-5 h-5 mr-2 text-blue-600" />
// // //               <h3 className="font-semibold">Acceleration</h3>
// // //             </div>
// // //             <p className="text-2xl">{acceleration.toFixed(2)} m/s²</p>
// // //           </div>
// // //         </div>

// // //         <div className="mt-8 p-4 bg-blue-50 rounded-lg">
// // //           <h3 className="font-semibold mb-2">Instructions</h3>
// // //           <ul className="list-disc list-inside space-y-2 text-sm">
// // //             <li>Click and drag the pendulum bob</li>
// // //             <li>Release to observe the motion</li>
// // //             <li>Watch real-time physics calculations</li>
// // //           </ul>
// // //         </div>
// // //       </div>

// // //       <div className="flex-1 bg-gray-900">
// // //         <Canvas>
// // //           <PendulumScene
// // //             setVelocity={setVelocity}
// // //             setAcceleration={setAcceleration}
// // //             setAmplitude={setAmplitude}
// // //             setPeriod={setPeriod}
// // //           />
// // //         </Canvas>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PhysicsLab;