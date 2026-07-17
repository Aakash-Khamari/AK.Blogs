'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'

function VibrantShape() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Very slow, extremely stable rotation. No vertical bouncing that causes clipping.
    meshRef.current.rotation.x = t * 0.1
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.z = t * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={2.5}>
      <torusKnotGeometry args={[1, 0.4, 256, 64]} />
      <MeshDistortMaterial 
        color="#ff4b4b" 
        emissive="#ff0055"
        emissiveIntensity={0.4}
        roughness={0.2} 
        metalness={0.8}
        distort={0.3}
        speed={1.5}
      />
    </mesh>
  )
}

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* Reduced FOV slightly so it doesn't clip the near plane easily */}
      <Canvas camera={{ position: [0, 0, 9], fov: 40 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#4b4bff" />
        <Environment preset="city" />
        
        {/* Placed firmly in the background, out of the way of the camera clipping plane */}
        <group position={[0, 0, -2]}>
          <VibrantShape />
          <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={30} blur={3} far={5} color="#ff0000" />
        </group>
      </Canvas>
    </div>
  )
}
