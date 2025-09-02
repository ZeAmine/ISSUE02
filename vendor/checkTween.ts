export const checkTween = (
  tweens: { [key: string]: gsap.core.Timeline | null } | gsap.core.Timeline | ScrollTrigger | null,
  key: string | null = null
): void => {
  if (!tweens) return

  if (key && typeof tweens === 'object' && !('kill' in tweens)) {
    tweens[key]?.kill()
    tweens[key] = null
  } else if (!key && 'kill' in tweens && typeof tweens.kill === 'function') {
    tweens.kill()
    tweens = null
  }
}

export const checkTrigger = (trigger: ScrollTrigger | null) => {
  if (trigger) {
    trigger.kill()
    trigger = null
  }
}

export const checkObserver = (observer: Observe | null) => {
  if (observer) {
    observer.destroy()
    observer = null
  }
}
