"use client"
import { Gradient } from "@/components/background/gradient"
import "@/app/globals.css"
import { useEffect, useRef } from "react"

const STAR_COUNT = 180

function initStars(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.003 + 0.001,
    phase: Math.random() * Math.PI * 2,
  }))

  let raf: number
  let t = 0

  function draw() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height)
    t += 1
    for (const s of stars) {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
      ctx!.beginPath()
      ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(255,255,255,${alpha})`
      ctx!.fill()
    }
    raf = requestAnimationFrame(draw)
  }

  draw()
  return () => cancelAnimationFrame(raf)
}

export const MeshGradient = () => {
  const gradientRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient("#gradient-canvas")

    const canvas = gradientRef.current
    if (canvas) {
      canvas.style.opacity = "0"
      canvas.style.transition = "opacity 1.2s ease"
      requestAnimationFrame(() => requestAnimationFrame(() => {
        canvas.style.opacity = "0.4"
      }))
    }

    const starsCanvas = starsRef.current
    let cleanupStars: (() => void) | undefined

    const onScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      if (canvas) canvas.style.opacity = String((1 - progress) * 0.4)
      if (starsCanvas) starsCanvas.style.opacity = String(progress)

      if (progress > 0 && !cleanupStars) {
        cleanupStars = initStars(starsCanvas!)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cleanupStars?.()
    }
  }, [])

  return (
    <>
      <canvas
        ref={gradientRef}
        style={{ opacity: 0, transition: "opacity 0.6s ease", position: "absolute", inset: 0, width: "100%", height: "100%" }}
        id="gradient-canvas"
        data-transition-in
      />
      <canvas
        ref={starsRef}
        style={{ opacity: 0, transition: "opacity 0.6s ease", position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </>
  )
}
