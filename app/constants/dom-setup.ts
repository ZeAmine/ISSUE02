export const DOM_SETUP = {
  DEFAULT: {
    init: true,
    show: true,
    destroy: true
  },
  NO_SHOW: {
    init: true,
    show: false,
    destroy: true
  },
  MINIMAL: {
    init: false,
    show: false,
    destroy: false
  }
} as const
