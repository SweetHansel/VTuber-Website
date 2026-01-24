'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface Live2DViewerProps {
  modelUrl: string
  className?: string
  width?: number
  height?: number
}

export function Live2DViewer({
  modelUrl,
  className,
  width = 400,
  height = 600,
}: Live2DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !modelUrl) return

    let app: InstanceType<typeof import('pixi.js').Application> | null = null
    let model: Awaited<ReturnType<typeof import('pixi-live2d-display').Live2DModel.from>> | null = null

    const loadModel = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import PixiJS and pixi-live2d-display
        const PIXI = await import('pixi.js')
        const { Live2DModel } = await import('pixi-live2d-display')

        // Register Live2DModel with PIXI
        // @ts-expect-error - PIXI Ticker type mismatch with Live2DModel
        Live2DModel.registerTicker(PIXI.Ticker)

        // Create PIXI application
        app = new PIXI.Application()
        await app.init({
          view: canvasRef.current!,
          width,
          height,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        })

        // Load Live2D model
        model = await Live2DModel.from(modelUrl)

        // Scale and position model
        model.scale.set(0.3)
        model.anchor.set(0.5, 0.5)
        model.x = width / 2
        model.y = height / 2

        app.stage.addChild(model)

        // Enable mouse tracking
        const onMouseMove = (e: MouseEvent) => {
          const rect = canvasRef.current?.getBoundingClientRect()
          if (!rect || !model) return

          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          model.focus(x, y)
        }

        canvasRef.current?.addEventListener('mousemove', onMouseMove)

        setIsLoading(false)

        return () => {
          canvasRef.current?.removeEventListener('mousemove', onMouseMove)
        }
      } catch (err) {
        console.error('Failed to load Live2D model:', err)
        setError('Failed to load model')
        setIsLoading(false)
      }
    }

    loadModel()

    return () => {
      if (model) {
        model.destroy()
      }
      if (app) {
        app.destroy(true)
      }
    }
  }, [modelUrl, width, height])

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
