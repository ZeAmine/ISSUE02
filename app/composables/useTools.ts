export const useTools = () => {
  // Math
  const math = {
    lerp: (xi: number, xf: number, t: number): number => (1 - t) * xi + t * xf,
    iLerp: (x: number, xi: number, xf: number): number => (x - xi) / (xf - xi),
    clamp: (x: number, min: number, max: number): number => Math.max(Math.min(x, max), min),
    map: (x: number, start1: number, end1: number, start2: number, end2: number): number => {
      return math.lerp(start2, end2, math.iLerp(x, start1, end1))
    },
    round: (x: number, decimal = 2): number => Number(x.toFixed(decimal))
  }

  // Type checking
  const is = {
    string: (e: unknown): e is string => typeof e === 'string',
    object: (e: unknown): e is object => e !== null && typeof e === 'object',
    array: <T>(e: unknown): e is T[] => Array.isArray(e),
    element: (e: unknown): e is HTMLElement => e instanceof HTMLElement
  }

  // DOM
  const select = (
    selector: string,
    context: Document | HTMLElement = document
  ): HTMLElement | null => {
    if (typeof window !== 'undefined') {
      return context.querySelector(selector)
    }
    return null
  }

  const selectAll = (
    selector: string,
    context: Document | HTMLElement = document
  ): Array<HTMLElement> | [] => {
    if (typeof window !== 'undefined') {
      return Array.from(context.querySelectorAll(selector))
    }
    return []
  }

  const create = <K extends keyof HTMLElementTagNameMap>(
    tag: K
  ): HTMLElementTagNameMap[K] | null => {
    if (typeof window !== 'undefined') {
      return document.createElement(tag)
    }
    return null
  }

  const rect = (element: HTMLElement): DOMRect | null => {
    if (typeof window !== 'undefined') {
      return element.getBoundingClientRect()
    }
    return null
  }

  const CL = {
    a: (e: HTMLElement | HTMLElement[], t: string): void => {
      if (Array.isArray(e)) {
        e.forEach((el: HTMLElement) => el.classList.add(t))
      } else {
        e.classList.add(t)
      }
    },
    r: (e: HTMLElement | HTMLElement[], t: string): void => {
      if (Array.isArray(e)) {
        e.forEach((el: HTMLElement) => el.classList.remove(t))
      } else {
        e.classList.remove(t)
      }
    },
    c: (e: HTMLElement | HTMLElement[], t: string): boolean => {
      if (Array.isArray(e)) {
        return e.every((el: HTMLElement) => el.classList.contains(t))
      } else {
        return e.classList.contains(t)
      }
    }
  }

  const index = <T>(target: T, array: T[]): number => {
    if (typeof window !== 'undefined') {
      return array.findIndex((item: T) => item === target)
    }
    return -1
  }
  const Index = {
    list: (element: Element): number => {
      if (typeof window !== 'undefined' && element.parentNode) {
        return index(element, Array.from(element.parentNode.children))
      }
      return -1
    },
    class: (
      element: Element,
      className: string,
      context: Document | HTMLElement = document
    ): number => {
      if (typeof window !== 'undefined') {
        return index(element, Array.from(context.getElementsByClassName(className)))
      }
      return -1
    },
    custom: <T>(target: T, array: T[]): number => {
      return index(target, array)
    }
  }

  // Object
  const Has = (e: object, t: string): boolean => Object.prototype.hasOwnProperty.call(e, t)

  // Style
  const OP = {
    on: (e: HTMLElement) => (e.style.opacity = '1'),
    off: (e: HTMLElement) => (e.style.opacity = '0')
  }
  const PE = {
    all: (e: HTMLElement) => (e.style.pointerEvents = 'all'),
    none: (e: HTMLElement) => (e.style.pointerEvents = 'none')
  }
  const Dp = {
    block: (e: HTMLElement) => (e.style.display = 'block'),
    flex: (e: HTMLElement) => (e.style.display = 'flex'),
    none: (e: HTMLElement) => (e.style.display = 'none')
  }
  const T = (e: HTMLElement | HTMLElement[], t: number, i: number, r?: string) => {
    r = r === undefined ? '%' : r
    const apply = (element: HTMLElement) => {
      element.style.transform = `translate3d(${t}${r}, ${i}${r}, 0)`
    }
    Array.isArray(e) ? e.forEach(apply) : apply(e)
  }

  // Attribute
  const Ga = (context: Element, attribute: string): string | null => context.getAttribute(attribute)

  // Device
  const device = computed(() => {
    if (typeof window !== 'undefined') {
      const uA = navigator.userAgent.toLowerCase()
      return {
        isMobile: /mobi|android|tablet|ipad|iphone/.test(uA),
        isIOS: /ipad|iphone/.test(uA) || (/mac/i.test(uA) && navigator.maxTouchPoints > 1),
        isAndroid: /android/i.test(uA),
        isSafari: /version\/[\d.]+.*safari/.test(uA) && !/android/i.test(uA),
        isFirefox: uA.includes('firefox'),
        isEdge: uA.includes('edge')
      }
    }
    return {
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isSafari: false,
      isFirefox: false,
      isEdge: false
    }
  })

  return {
    math,
    is,
    select,
    selectAll,
    create,
    rect,
    CL,
    Index,
    OP,
    PE,
    Dp,
    T,
    Ga,
    device
  }
}
