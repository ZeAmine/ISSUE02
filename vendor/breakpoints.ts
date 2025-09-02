import type { ViewportBreakpoints } from '@/utils/viewport'

export const breakpoints: { [key in ViewportBreakpoints]: number } = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1920
}

export function breakpoint(width: number): ViewportBreakpoints {
  if (width < breakpoints.sm) return <ViewportBreakpoints>'sm'
  if (width < breakpoints.md) return <ViewportBreakpoints>'md'
  if (width < breakpoints.lg) return <ViewportBreakpoints>'lg'
  if (width < breakpoints.xl) return <ViewportBreakpoints>'xl'
  if (width < breakpoints.xxl) return <ViewportBreakpoints>'xxl'
  return <ViewportBreakpoints>'xxl'
}
