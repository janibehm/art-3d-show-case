//@ts-nocheck
'use client'
import { ARButton, XR, Interactive, Controllers } from '@react-three/xr'
import { BalloonDog } from './Examples'

export function ARView({ currentColor }) {
  return (
    <div className='relative w-full h-full'>
      <ARButton
        className='absolute top-4 right-4 px-4 py-2 bg-black text-white rounded-md 
                   hover:bg-gray-800 transition-colors z-10'
      />
      <XR>
        <Controllers />
        <Interactive>
          <BalloonDog
            color={currentColor}
            scale={0.5} // Smaller scale for AR
            position={[0, 0, -1]} // Position in front of camera
            rotation={[0, 0, 0]}
          />
        </Interactive>
      </XR>
    </div>
  )
}
