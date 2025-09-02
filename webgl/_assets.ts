import type { Resource } from '@types/three'

const textures: Resource[] = [
  {
    name: 'texture-1',
    type: 'texture',
    path: '/images/1.webp'
  }
]

const models: Resource[] = []

const fonts: Resource[] = []

const sounds: Resource[] = []

export default [...textures, ...models, ...fonts, ...sounds]
