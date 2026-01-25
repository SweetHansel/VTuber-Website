'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { cn } from '@/lib/utils'

interface VRMViewerProps {
  modelUrl: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
}

function VRMModel({ modelUrl }: { modelUrl: string }) {
  const vrmRef = useRef<VRM | null>(null)
  const { camera } = useThree()

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      modelUrl,
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM

        if (vrm) {
          VRMUtils.removeUnnecessaryVertices(gltf.scene)
          VRMUtils.removeUnnecessaryJoints(gltf.scene)

          vrm.scene.traverse((obj) => {
            obj.frustumCulled = false
          })

          vrmRef.current = vrm

          // Position camera
          camera.position.set(0, 1.2, 2)
          camera.lookAt(0, 1, 0)
        }
      },
      (progress) => {
        console.log('Loading VRM:', (progress.loaded / progress.total) * 100, '%')
      },
      (error) => {
        console.error('Failed to load VRM:', error)
      }
    )

    return () => {
      if (vrmRef.current) {
        VRMUtils.deepDispose(vrmRef.current.scene)
      }
    }
  }, [modelUrl, camera])

  // Update VRM each frame
  useFrame((state, delta) => {
    if (vrmRef.current) {
      vrmRef.current.update(delta)
    }
  })

  return vrmRef.current ? <primitive object={vrmRef.current.scene} /> : null
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  )
}

export function VRMViewer({
  modelUrl,
  className,
  autoRotate = false,
  enableControls = true,
}: VRMViewerProps) {
  return (
    <div className={cn('relative', className)}>
      <Canvas
        camera={{ fov: 30, near: 0.1, far: 100 }}
        className="rounded-xl"
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        <Suspense fallback={<LoadingFallback />}>
          <VRMModel modelUrl={modelUrl} />
          <Environment preset="studio" />
        </Suspense>

        {enableControls && (
          <OrbitControls
            target={[0, 1, 0]}
            minDistance={1}
            maxDistance={5}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enablePan={false}
          />
        )}
      </Canvas>

      {/* Loading overlay */}
      <div className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white/60">
        Drag to rotate
      </div>
    </div>
  )
}
