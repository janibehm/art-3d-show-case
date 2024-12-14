'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useState } from 'react'

export function BalloonDog({ color = 'green', rotationSpeed = 0.5, onColorChange, ...props }) {
  const { scene } = useGLTF('/balloon-dog.glb')

  const colorValues = {
    green: '#00CC80', // Dark metallic green
    pink: '#FF0066', // Darker pink
    red: '#CC0000', // Much darker red
    blue: '#0099CC', // Dark blue
  }

  // Enhanced material properties for metallic colors
  const getMaterialProperties = (colorName) => {
    if (colorName === 'red') {
      return {
        color: colorValues[colorName],
        metalness: 1.1,
        roughness: 0.05,
        envMapIntensity: 2.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.2,
        emissive: '#990000',
        emissiveIntensity: 0.15,
      }
    }
    if (colorName === 'pink') {
      return {
        color: colorValues[colorName],
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 2.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.2,
        emissive: '#CC0052',
        emissiveIntensity: 0.15,
      }
    }
    return {
      color: colorValues[colorName],
      metalness: 1.5,
      roughness: 0.05,
      envMapIntensity: 2.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.2,
      emissive: colorValues[colorName],
      emissiveIntensity: 0.15,
    }
  }

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materialProps = getMaterialProperties(color)
        child.material = new THREE.MeshPhysicalMaterial(materialProps)
      }
    })
    if (onColorChange) onColorChange(color)
  }, [scene, color, onColorChange])

  useFrame((state, delta) => (scene.rotation.y += delta * rotationSpeed))

  return <primitive object={scene} {...props} />
}
