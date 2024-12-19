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
  const [scale, setScale] = useState(0.5)
  const meshRef = useRef<Mesh>(null)
  const touchStart = useRef<Vector3 | null>(null)

  const handlePlacement = (e) => {
    if (!placed && meshRef.current) {
      meshRef.current.position.copy(e.point)
      setPlaced(true)
      onPlaced()
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

  const handleScale = (e) => {
    if (placed && e.touches?.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      if (!touchStart.current) {
        touchStart.current = new Vector3(dist, 0, 0)
      } else {
        const delta = dist / touchStart.current.x
        setScale(Math.max(0.2, Math.min(2, delta * 0.5)))
      }
    }
  }

  return (
    <mesh
      ref={meshRef}
      rotation={[0, rotation, 0]}
      scale={scale}
      onPointerDown={handlePlacement}
      onPointerMove={(e) => {
        if (e.pointerType === 'touch') {
          handleRotation(e)
          handleScale(e)
        }
      }}
      onPointerUp={handleTouchEnd}
    >
      <BalloonDog color={currentColor} onColorChange={() => {}} />
    </mesh>
  )
}

export function ARView({ currentColor, onExit }) {
  const [isIOSDevice, setIsIOSDevice] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [placed, setPlaced] = useState(false)

  useEffect(() => {
    setIsIOSDevice(isIOS())
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => setIsARSupported(supported))
    }
  }, [])

  useEffect(() => {
    // Listen for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onExit?.() // Call onExit when user returns from AR
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [onExit])

  // iOS Quick Look AR
  if (isIOSDevice) {
    const filename = `balloon-dog-${currentColor.toLowerCase()}.usdz`
    window.location.href = `/${filename}`
    return null // Don't render anything, just redirect
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
