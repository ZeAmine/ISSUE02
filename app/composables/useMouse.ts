interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
  percentX: number
  percentY: number
  velocity: {
    x: number
    y: number
  }
  direction: {
    x: string
    y: string
  }
}

export const useMouse = () => {
  const { windowSize } = storeToRefs(useAppStore())

  // État
  const position = ref<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    percentX: 0,
    percentY: 0,
    velocity: { x: 0, y: 0 },
    direction: { x: 'none', y: 'none' }
  })

  const lastPosition = ref({ x: 0, y: 0 })
  const lastTime = ref(performance.now())
  const isMoving = ref(false)
  const moveTimeout = ref<NodeJS.Timeout | null>(null)

  // Getters
  const normalizedPosition = computed(() => ({
    x: (position.value.x / windowSize.value.width) * 2 - 1,
    y: -(position.value.y / windowSize.value.height) * 2 + 1
  }))

  const percentPosition = computed(() => ({
    x: (position.value.x / windowSize.value.width) * 100,
    y: (position.value.y / windowSize.value.height) * 100
  }))

  // Actions
  function updatePosition(event: MouseEvent) {
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTime.value

    const velocityX = (event.clientX - lastPosition.value.x) / deltaTime
    const velocityY = (event.clientY - lastPosition.value.y) / deltaTime

    const direction = {
      x: velocityX > 0 ? 'right' : velocityX < 0 ? 'left' : 'none',
      y: velocityY > 0 ? 'down' : velocityY < 0 ? 'up' : 'none'
    }

    position.value = {
      x: event.clientX,
      y: event.clientY,
      normalizedX: (event.clientX / windowSize.value.width) * 2 - 1,
      normalizedY: -(event.clientY / windowSize.value.height) * 2 + 1,
      percentX: (event.clientX / windowSize.value.width) * 100,
      percentY: (event.clientY / windowSize.value.height) * 100,
      velocity: { x: velocityX, y: velocityY },
      direction: { x: direction.x, y: direction.y }
    }

    lastPosition.value = { x: event.clientX, y: event.clientY }
    lastTime.value = currentTime

    setIsMoving(true)
  }

  function setIsMoving(moving: boolean) {
    isMoving.value = moving

    if (moveTimeout.value) {
      clearTimeout(moveTimeout.value)
    }

    if (moving) {
      moveTimeout.value = setTimeout(() => {
        isMoving.value = false
      }, 100)
    }
  }

  return {
    position,
    isMoving,
    normalizedPosition,
    percentPosition,
    updatePosition
  }
}
