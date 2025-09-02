export function usePageTransition() {
  const { $gsap: gsap, $dom: dom } = useNuxtApp()

  const TRANSITION_DELAY = 400

  const transitionOut = ({ element, path }: ITransitionParams): Promise<void> => {
    if (!(path && element)) {
      throw new Error('Missing required parameters')
    }

    dom?.destroy()

    gsap.fromTo(
      '.overlay',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        ease: 'transitionOut',
        overwrite: true
      }
    )

    // const match = findTransition(path.fromRoute, path.toRoute)
    // if (!match) throw new Error('No transition found')
    // match.leave(element as HTMLElement)

    return new Promise<void>((resolve) => {
      return window.requestAnimationFrame(() => {
        setTimeout(resolve, TRANSITION_DELAY)
      })
    })
  }

  const transitionIn = ({ element, path }: ITransitionParams): Promise<void> => {
    if (!(path && element)) {
      throw new Error('Missing required parameters')
    }

    dom?.init({ element })
    dom?.show()

    // const match = findTransition(path.fromRoute, path.toRoute)
    // if (!match) throw new Error('No transition found')
    // match.enter(element as HTMLElement)

    return new Promise<void>((resolve) => {
      return window.requestAnimationFrame(() => {
        setTimeout(resolve, TRANSITION_DELAY)
      })
    })
  }

  return {
    transitionOut,
    transitionIn
  }
}
