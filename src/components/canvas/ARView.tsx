'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState, useEffect, useRef } from 'react'
import { BalloonDog } from './Examples'
import { Mesh, Vector3 } from 'three'

// Check if device is iOS
const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent))
  )
}

// Create XR store outside component
const store = createXRStore()

function Model({ currentColor, onPlaced }) {
  const [placed, setPlaced] = useState(false)
  const [rotation, setRotation] = useState(0)
  const meshRef = useRef<Mesh>(null)
  const touchStart = useRef<Vector3 | null>(null)

  const handlePlacement = (e) => {
    if (!placed && meshRef.current) {
      // Place on detected surface
      meshRef.current.position.copy(e.point)
      setPlaced(true)
    }
  }

  const handleRotation = (e) => {
    if (placed && e.touches?.length === 2) {
      // Two finger rotation
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const angle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX)

      if (!touchStart.current) {
        touchStart.current = new Vector3(0, angle, 0)
      } else {
        const delta = angle - touchStart.current.y
        setRotation(rotation + delta)
      }
    }
  }

  const handleTouchEnd = () => {
    touchStart.current = null
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[0, rotation, 0]}
      onPointerDown={handlePlacement}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch') handleRotation(e)
      }}
      onPointerUp={handleTouchEnd}
    >
      <BalloonDog color={currentColor} scale={0.5} onColorChange={() => {}} />
    </mesh>
  )
}

export function ARView({ currentColor }) {
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [placed, setPlaced] = useState(false)

  useEffect(() => {
    setIsIOSDevice(isIOS())
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => setIsARSupported(supported))
    }
  }, [])

  // iOS Quick Look AR
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

  // WebXR AR for other devices
  return (
    <>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <Model currentColor={currentColor} onPlaced={() => setPlaced(true)} />
        </XR>
      </Canvas>
      {placed && (
        <div className='fixed bottom-4 left-4 text-sm text-white bg-black/50 p-2 rounded'>
          Use two fingers to rotate the model
        </div>
      )}
    </>
  )
}
