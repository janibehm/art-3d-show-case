'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { Line, useCursor, MeshDistortMaterial } from '@react-three/drei'
import { useRouter } from 'next/navigation'

export const Blob = ({ route = '/', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

export function RoseRing({ color = 'red', rotationSpeed = 0.5, ...props }) {
  const { scene } = useGLTF('/rose-ring.glb')

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color })
      }
    })
  }, [scene, color])

  useFrame((state, delta) => (scene.rotation.y += delta * rotationSpeed))

  return <primitive object={scene} {...props} />
}

export function BlackRing({ color = 'black', rotationSpeed = 0.5, ...props }) {
  const { scene } = useGLTF('/black-ring.glb')

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color })
      }
    })
  }, [scene, color])

  useFrame((state, delta) => (scene.rotation.y += delta * rotationSpeed))

  return <primitive object={scene} {...props} />
}

export function GoldenRing({ color = 'gold', rotationSpeed = 0.5, ...props }) {
  const { scene } = useGLTF('/golden-ring.glb')

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color })
      }
    })
  }, [scene, color])

  useFrame((state, delta) => (scene.rotation.y += delta * rotationSpeed))

  return <primitive object={scene} {...props} />
}
