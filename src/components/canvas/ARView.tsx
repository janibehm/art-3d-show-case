'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState, useEffect, useRef } from 'react'
import { BalloonDog } from './Examples'
import { Mesh } from 'three'

// Check if device is iOS
const isIOS = () => {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

// Create XR store outside component
const store = createXRStore()

function Model({ currentColor }) {
  const [placed, setPlaced] = useState(false)
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      onClick={(event) => {
        if (!placed) {
          meshRef.current.position.copy(event.point)
          setPlaced(true)
        }
      }}
    >
      <BalloonDog color={currentColor} scale={0.5} onColorChange={() => {}} />
    </mesh>
  )
}

export function ARView({ currentColor }) {
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    setIsIOSDevice(isIOS())
  }, [])

  if (isIOSDevice) {
    return (
      <a rel='ar' href='/balloon-dog.usdz' className='absolute top-4 right-4 px-4 py-2 bg-black text-white rounded-md'>
        View in AR
      </a>
    )
  }

  return (
    <>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Model currentColor={currentColor} />
        </XR>
      </Canvas>
    </>
  )
}
