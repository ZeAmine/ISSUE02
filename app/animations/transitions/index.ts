import { ROUTES } from '@/constants/routes'

import { aboutToHome } from './pages/about-to-home'
import { aboutToWorks } from './pages/about-to-works'
import { homeToAbout } from './pages/home-to-about'
import { homeToWorks } from './pages/home-to-works'
import { workToWorks } from './pages/work-to-works'
import { worksToAbout } from './pages/works-to-about'
import { worksToHome } from './pages/works-to-home'
import { worksToWork } from './pages/works-to-work'

interface IDefaultAnim {
  darkTheme: ITheme
  beigeTheme: ITheme
  purpleTheme: ITheme
}

export const defaultAnim: IDefaultAnim = {
  darkTheme: {
    text: '#ffffff',
    background: '#000000'
  },
  beigeTheme: {
    text: '#000000',
    background: '#f4efe3'
  },
  purpleTheme: {
    text: '#ffffff',
    background: '#4b3f72'
  }
}

export const transitions = [
  homeToAbout({
    fromRoute: ROUTES.HOME,
    toRoute: ROUTES.ABOUT,
    theme: defaultAnim.beigeTheme
  }),
  homeToWorks({
    fromRoute: ROUTES.HOME,
    toRoute: ROUTES.WORKS,
    theme: defaultAnim.beigeTheme
  }),
  worksToAbout({
    fromRoute: ROUTES.WORKS,
    toRoute: ROUTES.ABOUT,
    theme: defaultAnim.darkTheme
  }),
  worksToHome({
    fromRoute: ROUTES.WORKS,
    toRoute: ROUTES.HOME,
    theme: defaultAnim.darkTheme
  }),
  aboutToWorks({
    fromRoute: ROUTES.ABOUT,
    toRoute: ROUTES.WORKS,
    theme: defaultAnim.beigeTheme
  }),
  aboutToHome({
    fromRoute: ROUTES.ABOUT,
    toRoute: ROUTES.HOME,
    theme: defaultAnim.purpleTheme
  }),
  worksToWork({
    fromRoute: ROUTES.WORKS,
    toRoute: ROUTES.WORK,
    theme: defaultAnim.beigeTheme
  }),
  workToWorks({
    fromRoute: ROUTES.WORK,
    toRoute: ROUTES.WORKS,
    theme: defaultAnim.beigeTheme
  })
]

export function findTransition(from: string, to: string) {
  return transitions.find((transition) => {
    return transition.when({ fromRoute: from, toRoute: to })
  })
}
