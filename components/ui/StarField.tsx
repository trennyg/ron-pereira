'use client'

import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let mx = W/2, my = H/2, smx = W/2, smy = H/2
    let raf: number, lastT = 0

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    const onMouse  = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('resize', onResize, { passive:true })
    window.addEventListener('mousemove', onMouse, { passive:true })

    // Fewer stars, 2 layers only
    const layers = [
      { stars: Array.from({length:55}, () => ({ x:Math.random(), y:Math.random(), r:Math.random()*0.7+0.2, o:Math.random()*0.22+0.05, tw:Math.random()*3+2 })), par:10 },
      { stars: Array.from({length:35}, () => ({ x:Math.random(), y:Math.random(), r:Math.random()*0.4+0.1, o:Math.random()*0.12+0.03, tw:Math.random()*5+3 })), par:4  },
    ]

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      // Only draw every 2nd frame for performance
      if (ts - lastT < 28) return
      lastT = ts

      ctx.clearRect(0, 0, W, H)
      smx += (mx-smx)*0.035; smy += (my-smy)*0.035
      const ox = (smx-W/2)/W, oy = (smy-H/2)/H

      // Warm spotlight
      const sg = ctx.createRadialGradient(smx, smy, 0, smx, smy, 280)
      sg.addColorStop(0, 'rgba(160,75,8,0.045)'); sg.addColorStop(1, 'transparent')
      ctx.fillStyle = sg; ctx.fillRect(0,0,W,H)

      layers.forEach(layer => {
        layer.stars.forEach(s => {
          const sx = ((s.x*W + ox*layer.par*8) % W + W) % W
          const sy = ((s.y*H + oy*layer.par*8) % H + H) % H
          const tw = 0.5 + 0.5*Math.sin(ts*s.tw*0.0007 + s.x*20)
          ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI*2)
          ctx.fillStyle = `rgba(215,205,195,${(s.o*tw).toFixed(2)})`; ctx.fill()
        })
      })
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',onResize); window.removeEventListener('mousemove',onMouse) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:1,opacity:0.65}} />
}
