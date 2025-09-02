import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import type { BaseLoader, Resource } from '@types/three'

class ThreeGLTFDracoLoader implements BaseLoader {
  loader: GLTFLoader
  dracoLoader!: DRACOLoader
  dracoDecoder!: string

  constructor(options: { decoder: string }) {
    this.dracoDecoder = options.decoder

    this.loader = new GLTFLoader()

    if (this.dracoDecoder) {
      this.dracoLoader = new DRACOLoader()
      this.dracoLoader.setDecoderPath(this.dracoDecoder)
      this.loader.setDRACOLoader(this.dracoLoader)
    }
  }

  load({ path }: Resource) {
    return new Promise((resolve, reject) => {
      this.loader.load(path, resolve, undefined, reject)
    })
  }
}

export default ThreeGLTFDracoLoader
