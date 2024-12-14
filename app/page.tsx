'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'
import { OrbitControls, SpotLight, Environment } from '@react-three/drei'

const BalloonDog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.BalloonDog), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
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

export default function Page() {
  const [currentColor, setCurrentColor] = useState('green')

  // Define color values
  const colorValues = {
    green: '#00CC80', // Dark metallic green
    pink: '#FF0066', // Darker pink
    red: '#CC0000', // Much darker red
    blue: '#0099CC', // Dark blue
  }

  const colors = Object.keys(colorValues)

  const colorDescriptions = {
    green: {
      title: 'Green Balloon Dog',
      description: 'A vibrant interpretation of the classic balloon dog, finished in shimmering green.',
      details: 'This piece represents nature and modernity in perfect harmony.',
    },
    pink: {
      title: 'Pink Balloon Dog',
      description: 'A playful and elegant take on the balloon dog, rendered in metallic pink.',
      details: 'Perfect for adding a touch of whimsy and sophistication to any space.',
    },
    red: {
      title: 'Ruby Balloon Dog',
      description: 'Bold and passionate, this red balloon dog makes a striking statement.',
      details: 'Brings energy and vibrancy to any setting.',
    },
    blue: {
      title: 'Sapphire Balloon Dog',
      description: 'A cool and calming presence in deep blue tones.',
      details: 'Reminiscent of ocean depths and summer skies.',
    },
  }

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor)
  }

  const handleNextColor = () => {
    const currentIndex = colors.indexOf(currentColor)
    const nextIndex = (currentIndex + 1) % colors.length
    setCurrentColor(colors[nextIndex])
  }

  const handlePreviousColor = () => {
    const currentIndex = colors.indexOf(currentColor)
    const previousIndex = (currentIndex - 1 + colors.length) % colors.length
    setCurrentColor(colors[previousIndex])
  }

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #ffe0e0;
        }
      `}</style>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center min-h-screen'>
          <div className='w-full max-w-4xl mb-8' style={{ height: '65vh' }}>
            <View className='h-full'>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <SpotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                <SpotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                <Environment preset='studio' />

                <BalloonDog
                  color={currentColor}
                  scale={2.2}
                  position={[0, -2, 0]}
                  rotation={[0, 0, 0]}
                  rotationSpeed={0.2}
                  onColorChange={handleColorChange}
                />
              </Suspense>
              <OrbitControls
                enableZoom={false}
                enablePan={true}
                enableRotate={true}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                minDistance={2}
                maxDistance={12}
              />
            </View>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl'>
            <div className='space-y-3'>
              <h2 className='text-xl font-bold'>{colorDescriptions[currentColor].title}</h2>
              <p className='text-gray-600 text-sm'>{colorDescriptions[currentColor].description}</p>
            </div>

            <div className='space-y-3'>
              <h2 className='text-xl font-bold'>Details</h2>
              <p className='text-gray-600 text-sm'>{colorDescriptions[currentColor].details}</p>
            </div>

            <div className='flex flex-col justify-start gap-3'>
              <div className='flex items-center gap-3'>
                <h2 className='text-xl font-bold'>Variant</h2>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={handlePreviousColor}
                    className='p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm'
                  >
                    ←
                  </button>
                  <select
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className='px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 
                              transition-colors cursor-pointer focus:outline-none focus:ring-2 
                              focus:ring-white focus:ring-offset-2 focus:ring-offset-[#ffe0e0]'
                  >
                    <option value='green'>Emerald</option>
                    <option value='pink'>Rose</option>
                    <option value='red'>Ruby</option>
                    <option value='blue'>Sapphire</option>
                  </select>
                  <button
                    onClick={handleNextColor}
                    className='p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm'
                  >
                    →
                  </button>
                </div>
              </div>

              <a
                href='https://www.etsy.com/fi-en/listing/1726413506/blue-resin-balloon-dog-desk-sculpture'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block px-6 py-2 text-base font-semibold text-black bg-white rounded-full 
                         border-2 border-black hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105 mt-2'
              >
                Buy Here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
