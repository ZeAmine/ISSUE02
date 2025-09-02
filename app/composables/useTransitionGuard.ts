import type { RouteLocationNormalized } from 'vue-router'

export const useTransitionGuard = () => {
  const isProjectRoute = (to: RouteLocationNormalized, from: RouteLocationNormalized): boolean => {
    return from.path?.toString().startsWith('/works/') && to.path?.toString().startsWith('/works/')
  }

  return {
    isProjectRoute
  }
}
