import { ROUTES } from '@/constants/routes'
import { isRoutePathMatch } from '../common/route-matcher'
import { themeState } from '../common/theme-state'

export const homeToAbout = (props: ITransitionProps) => ({
  name: 'homeToAbout',
  when: ({ fromRoute, toRoute }: Pick<ITransitionProps, 'fromRoute' | 'toRoute'>) => {
    return isRoutePathMatch(fromRoute, toRoute, ROUTES.HOME, ROUTES.ABOUT)
  },
  leave: (pageElement: HTMLElement) => {
    // return gsap.timeline()
    // .add(() => $root.dom?.destroy())
  },
  enter: (pageElement: HTMLElement) => {
    // return gsap.timeline({
    //   onStart: () => themeState(props, pageElement)
    // })
  }
})
