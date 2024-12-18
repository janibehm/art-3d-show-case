'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState, useEffect, useRef } from 'react'
import { BalloonDog } from './Examples'
import { Mesh } from 'three'

// Check if device is iOS
const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))
  )
}

// Create XR store outside component
const store = createXRStore()

function Model({ currentColor }) {
  const [placed, setPlaced] = useState(false)
  const isDraggingRef = useRef(false)
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      onPointerDown={(e) => {
        if (!placed) {
          meshRef.current.position.copy(e.point)
          setPlaced(true)
        } else if (isDraggingRef.current) {
          return
        }
        isDraggingRef.current = true
      }}
      onPointerMove={(e) => {
        if (!isDraggingRef.current) return
        meshRef.current.position.copy(e.point)
      }}
      onPointerUp={() => {
        isDraggingRef.current = false
      }}
    >
      <BalloonDog color={currentColor} scale={0.5} onColorChange={() => {}} />
    </mesh>
  )
}

export function ARView({ currentColor }) {
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsIOSDevice(isIOS())
    // Check AR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => setIsARSupported(supported))
    }
  }, [])

  if (!isARSupported && !isIOSDevice) {
    return <div>AR not supported on this device</div>
  }

  if (isIOSDevice) {
    const filename = `balloon-dog-${currentColor.toLowerCase()}.usdz`

    return (
      <div className='fixed top-4 right-4 flex flex-col gap-2'>
        <a rel='ar' href={`/${filename}`} className='px-4 py-2 bg-black text-white rounded-md'>
          View in AR ({currentColor})
        </a>
      </div>
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
