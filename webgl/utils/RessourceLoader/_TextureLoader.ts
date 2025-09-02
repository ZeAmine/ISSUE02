import { TextureLoader, type Texture } from 'three'

import type { BaseLoader, Resource } from '@types/three'

interface ExtendedSource {
  width?: number
  height?: number
  ratio?: number
  data: {
    width: number
    height: number
  }
}

class ThreeTextureLoader implements BaseLoader {
  loader: TextureLoader

  constructor() {
    this.loader = new TextureLoader()
  }

  load({ path }: Resource) {
    return new Promise((resolve, _) => {
      this.loader.load(path, (data: Texture & { source: ExtendedSource }): void => {
        data.flipY = true
        data.needsUpdate = true

        data.source.width = data.source.data.width || 0
        data.source.height = data.source.data.height || 0
        data.source.ratio = data.source.data.width / data.source.data.height || 0

        resolve(data)
      })
    })
  }
}

export default ThreeTextureLoader
