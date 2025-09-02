export function lerp(s: number, e: number, m: number) {
  return s * (1 - m) + e * m
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function damp(a: number, b: number, lambda: number, deltaTime: number): number {
  const t = 1 - Math.exp(-lambda * deltaTime)
  return a + (b - a) * t
}

export function symmetricMod(value: number, base: number): number {
  let m = value % base
  if (Math.abs(m) > base / 2) {
    m = m > 0 ? m - base : m + base
  }
  return m
}

export function shuffle(array: string[]): string[] {
  return array.sort(() => Math.random() - 0.5)
}

export function mapRange(
  value: number,
  inStart: number,
  inEnd: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((outMax - outMin) / (inEnd - inStart)) * (value - inStart)
}

/** ------------ Angles **/
export function radToDeg(r: number): number {
  return (r * 180) / Math.PI
}

export function degToRad(d: number): number {
  return (d * Math.PI) / 180
}

/** ------------ Bitwise **/
export const isPowerOfTwo = (n: number): boolean => !!n && (n & (n - 1)) === 0
