import type { Resource } from '@types/three'

const textures: Resource[] = [
  {
    name: 'texture-1',
    type: 'texture',
    path: '/images/1.webp'
  },
  {
    name: 'texture-2',
    type: 'texture',
    path: '/images/2.webp'
  },
  {
    name: 'texture-3',
    type: 'video',
    path: '/videos/1.mp4'
  },
  {
    name: 'texture-4',
    type: 'texture',
    path: '/images/4.webp'
  },
  {
    name: 'texture-5',
    type: 'texture',
    path: '/images/5.webp'
  },
  {
    name: 'texture-6',
    type: 'texture',
    path: '/images/6.webp'
  },
  {
    name: 'texture-7',
    type: 'texture',
    path: '/images/7.webp'
  },
  {
    name: 'texture-8',
    type: 'texture',
    path: '/images/8.webp'
  }
]

const models: Resource[] = []

const fonts: Resource[] = [
  {
    name: 'font-1',
    type: 'font',
    path: '/fonts/Roboto/Roboto-Bold.png'
  }
]

const sounds: Resource[] = []

export default [...textures, ...models, ...fonts, ...sounds]
