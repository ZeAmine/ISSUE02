import { Color, GLSL3, RawShaderMaterial, type Texture } from 'three'

import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

interface Uniforms {
  tMap: Texture | null
  uColor?: Color | null | undefined
  uAlpha?: number
}

export class TextMaterial extends RawShaderMaterial {
  constructor(options: Uniforms) {
    super({
      glslVersion: GLSL3,
      vertexShader,
      fragmentShader,
      transparent: true
    })

    this.uniforms = {
      tMap: { value: options.tMap },
      uColor: { value: this.parseColor(options.uColor) },
      uAlpha: { value: options.uAlpha ?? 1 }
    }
  }

  private parseColor(color: Color | null | undefined): Color {
    if (!color) return new Color()
    return color instanceof Color ? color : new Color(color)
  }

  set tMap(value: Texture) {
    this.uniforms.tMap.value = value
  }

  set uColor(value: Color) {
    this.uniforms.uColor.value = value
  }

  set uAlpha(value: number) {
    this.uniforms.uAlpha.value = value
  }
}
