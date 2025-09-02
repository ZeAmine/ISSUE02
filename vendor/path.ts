import type { RuntimeConfig } from 'nuxt/schema'

export const getPath = (runtimeConfig: RuntimeConfig, path: string): string => {
  if (!path) throw new Error('Path is undefined')
  return `${runtimeConfig.public.WEB_BACKEND_URL}${path}`
}

export const getUrl = (runtimeConfig: RuntimeConfig, base: string): string => {
  if (!runtimeConfig?.public) {
    throw new Error('Invalid runtime configuration')
  }
  if (!base) {
    throw new Error('Base path is required')
  }

  const key = 'public'
  const index = import.meta.url.lastIndexOf(key)
  const path = import.meta.url.substring(0, index + key.length)

  return runtimeConfig.public.PACKAGE_CONTEXT === 'app' ? `${path}${base}` : base
}
