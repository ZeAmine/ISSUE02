import { VideoTexture } from 'three'

import type { BaseLoader, Resource } from '@types/three'

class ThreeVideoLoader implements BaseLoader {
  load({ path }: Resource) {
    return new Promise((resolve): void => {
      const video = document.createElement('video')

      video.setAttribute('webkit-playsinline', 'webkit-playsinline')
      video.setAttribute('playsinline', '')

      video.controls = false
      video.playsInline = true
      video.muted = true
      video.loop = true
      video.autoplay = true
      video.crossOrigin = 'anonymous'

      video.src = path
      video.preload = 'auto'

      const texture = new VideoTexture(video)

      video.play()

      video.onloadedmetadata = () => {
        resolve({
          texture,
          path,
          video
        })
      }
    })
  }
}

export default ThreeVideoLoader
