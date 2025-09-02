export default defineNuxtPlugin(() => {
  const { updatePosition } = useMouse()

  let rafId: number | null = null

  const handleMouseMove = (event: MouseEvent) => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(() => {
      updatePosition(event)
      eventEmitter.emit('MOUSE:MOVE', { x: event.clientX, y: event.clientY })
      rafId = null
    })
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      handleMouseMove(touch as unknown as MouseEvent)
    }
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
})
