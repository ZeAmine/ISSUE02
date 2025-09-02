import { GLSL3, NoBlending, ShaderMaterial, type Texture } from 'three'

import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

interface Uniforms {
  tFlow: Texture | null
}

export class FlowmapMaterial extends ShaderMaterial {
  constructor(options: Uniforms) {
    super({
      glslVersion: GLSL3,
      vertexShader,
      fragmentShader,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false
    })

    this.uniforms = {
      tScene: { value: null },
      tFlow: { value: options.tFlow }
    }
  }

  set tScene(value: Texture | null) {
    this.uniforms.tScene.value = value
  }

  set tFlow(value: Texture | null) {
    this.uniforms.tFlow.value = value
  }
}
