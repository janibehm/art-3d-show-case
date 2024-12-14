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
      title: 'Metallic Green Balloon Dog',
      description: 'A vibrant interpretation of the classic balloon dog, finished in shimmering green.',
      details: 'This piece represents nature and modernity in perfect harmony.',
    },
    pink: {
      title: 'Pink Pink Balloon Dog',
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
        <div className='flex flex-col items-center min-h-screen py-8'>
          <div className='w-full max-w-4xl mb-12' style={{ height: '70vh' }}>
            <div className='absolute left-8 top-8 flex flex-col gap-2 z-10'>
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`px-4 py-2 rounded-md transition-colors bg-black text-white
                    ${currentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#ffe0e0]' : 'opacity-75 hover:opacity-100'}`}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>

            <div className='absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10'>
              <button
                onClick={handlePreviousColor}
                className='p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors'
              >
                ↑
              </button>
              <button
                onClick={handleNextColor}
                className='p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors'
              >
                ↓
              </button>
            </div>

            <View className='h-full'>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <SpotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                <SpotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} castShadow />
                <Environment preset='studio' />

                <BalloonDog
                  color={currentColor}
                  scale={2.5}
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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl mb-8'>
            <div className='space-y-4'>
              <h2 className='text-2xl font-bold'>{colorDescriptions[currentColor].title}</h2>
              <p className='text-gray-600'>{colorDescriptions[currentColor].description}</p>
            </div>

            <div className='space-y-4'>
              <h2 className='text-2xl font-bold'>Details</h2>
              <p className='text-gray-600'>{colorDescriptions[currentColor].details}</p>
            </div>
          </div>

          <a
            href='https://www.etsy.com/fi-en/listing/1726413506/blue-resin-balloon-dog-desk-sculpture?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=balloon+dog+jeff+koons&ref=sr_gallery-1-9&pro=1&frs=1&sts=1&content_source=57606a26f146ee3257c88608720c72c6b3bfc584%253A1726413506&search_preloaded_img=1&organic_search_click=1'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block px-8 py-3 text-lg font-semibold text-white bg-black rounded-full 
                     hover:bg-gray-800 transition-colors duration-200 transform hover:scale-105'
          >
            Buy Here
          </a>
        </div>
      </div>
    </>
  )
}
