export const useCursor = () => {
  const cursorPos = useState('cursorPos', () => ({
    current: { x: 0.5, y: 0.5 },
    target: { x: 0.5, y: 0.5 }
  }))

  /**
   * Définit la position actuelle du curseur
   */
  const setCursorPosCurrent = (x: number, y: number) => {
    cursorPos.value.current.x = x
    cursorPos.value.current.y = y
  }

  /**
   * Définit la position cible du curseur
   */
  const setCursorPosTarget = (mouseX: number, mouseY: number) => {
    cursorPos.value.target.x = mouseX / window.innerWidth
    cursorPos.value.target.y = mouseY / window.innerHeight
  }

  return {
    cursorPos,
    setCursorPosCurrent,
    setCursorPosTarget
  }
}

export const useCursorLabel = () => {
  const label = ref('Scroll down')
  const isVisible = ref(false)

  const updateLabel = (newLabel: string) => {
    label.value = newLabel
    isVisible.value = true
  }

  /**
   * Masque le libellé
   */
  const hideLabel = () => {
    isVisible.value = false
  }

  /**
   * Classe CSS conditionnelle
   */
  const labelClasses = computed(() => ({
    'cursor-label': true,
    'slash-light': true,
    'p7': true,
    'ttu': true,
    'fw440': true,
    'cursor-label--visible': isVisible.value
  }))

  return {
    label,
    isVisible,
    labelClasses,
    updateLabel,
    hideLabel
  }
}
