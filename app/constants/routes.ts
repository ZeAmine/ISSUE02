export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  WORKS: '/works',
  WORK: '/works/'
} as const

export const CONFIG = {
  duration: {
    short: 0.6,
    medium: 0.8,
    long: 1.2
  },
  ease: {
    standard: '--o56',
    smooth: '--o3'
  },
  delay: {
    short: 0.2,
    medium: 0.3,
    long: 0.4
  }
} as const
