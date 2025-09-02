import { ROUTES } from '@/constants/routes'

export interface IThemeColors {
  text: string
  background: string
}

export const THEMES = {
  light: {
    text: '#000000',
    background: '#ffffff'
  },
  dark: {
    text: '#ffffff',
    background: '#1d1d1d'
  }
} as const

export const ROUTE_THEMES: Record<string, IThemeColors> = {
  [ROUTES.HOME]: THEMES.light,
  [ROUTES.ABOUT]: THEMES.light,
  [ROUTES.WORKS]: THEMES.dark,
  [ROUTES.WORK]: THEMES.light
}

export const themeState = ({ text, background }: IThemeColors): void => {
  const root = document.documentElement
  if (text) {
    root.style.setProperty('--text-color', text)
  }
  if (background) {
    root.style.setProperty('--bg-color', background)
  }
}

export const applyTheme = (route: string): void => {
  let theme = THEMES.light as IThemeColors
  if (ROUTE_THEMES[route]) {
    theme = ROUTE_THEMES[route]
  } else if (route.startsWith(ROUTES.WORK)) {
    theme = ROUTE_THEMES[ROUTES.WORK]
  }

  themeState(theme)
}
