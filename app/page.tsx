'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { OrbitControls } from '@react-three/drei'

const RoseRing = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.RoseRing), { ssr: false })
const BlackRing = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.BlackRing), { ssr: false })
const GoldenRing = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.GoldenRing), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const components = [
    <RoseRing route='/blob' scale={1.5} position={[0, 0, 0]} rotationSpeed={0.3} />,
    <GoldenRing scale={1.5} position={[0, 0, 0]} rotation={[0, 0, 0]} rotationSpeed={0.3} />,
    <BlackRing route='/blob' scale={1.5} position={[0, 0, 0]} rotationSpeed={0.3} />,
  ]

  return (
    <div className='container mx-auto px-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center min-h-screen'>
        {/* Left Text Section */}
        <div className='text-center md:text-right space-y-4'>
          <h2 className='text-2xl font-bold'>About Our Rings</h2>
          <p className='text-gray-600'>
            Discover our exclusive collection of handcrafted rings, each piece telling its own unique story.
          </p>
        </div>

        {/* Center 3D View Section */}
        <div className='flex flex-col items-center'>
          <View className='h-[500px] w-full'>
            <Suspense fallback={null}>
              {components[currentIndex]}
              <Common color='white' />
            </Suspense>
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
              minDistance={2}
              maxDistance={10}
            />
          </View>

          {/* Navigation Buttons */}
          <div className='flex gap-4 mt-6'>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + components.length) % components.length)}
              className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % components.length)}
              className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Text Section */}
        <div className='text-center md:text-left space-y-4'>
          <h2 className='text-2xl font-bold'>Ring Details</h2>
          <p className='text-gray-600'>
            Each ring is meticulously designed with attention to detail and crafted with premium materials.
          </p>
        </div>
      </div>
    </div>
  )
}
