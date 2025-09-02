import { DoubleSide, ShaderMaterial, type Texture, type Vector2 } from 'three'

import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

interface Uniforms {
  uTexture: Texture | null
  uResolution: Vector2
  uScale: Vector2
  uViewport: Vector2
  uAspect: number
  uAlpha: number
}

export class WorksMaterial extends ShaderMaterial {
  constructor(options: Uniforms) {
    super({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: true
      // wireframe: true
    })

    this.uniforms = {
      uTime: { value: 0 },
      uTexture: { value: options.uTexture },
      uResolution: { value: options.uResolution },
      uScale: { value: options.uScale },
      uViewport: { value: options.uViewport },
      uAspect: { value: options.uAspect },
      uAlpha: { value: options.uAlpha }
    }
  }

  set uTime(value: number) {
    this.uniforms.uTime.value = value
  }

  set uTexture(value: Texture) {
    this.uniforms.uTexture.value = value
  }

  set uResolution(value: Vector2) {
    this.uniforms.uResolution.value = value
  }

  set uScale(value: Vector2) {
    this.uniforms.uScale.value = value
  }

  set uViewport(value: Vector2) {
    this.uniforms.uViewport.value = value
  }

  set uAspect(value: number) {
    this.uniforms.uAspect.value = value
  }

  set uAlpha(value: number) {
    this.uniforms.uAlpha.value = value
  }
}
