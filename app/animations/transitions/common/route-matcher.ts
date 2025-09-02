export const isProjectRoute = (path: string): boolean => {
  return /^\/works\/[^/]+$/.test(path)
}

export const extractProjectSlug = (path: string): string | null => {
  const match = path.match(/^\/works\/([^/]+)$/)
  return match ? match[1] : null
}

export const isRoutePathMatch = (fromRoute: string, toRoute: string, fromPath: string, toPath: string): boolean => {
  if (fromPath.includes(':slug')) {
    return isProjectRoute(fromRoute) && toRoute === '/works'
  }
  if (toPath.includes(':slug')) {
    return fromRoute === '/works' && isProjectRoute(toRoute)
  }

  return fromRoute === fromPath && toRoute === toPath
}
