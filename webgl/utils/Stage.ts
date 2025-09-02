import { Interface } from './Interface'

interface StageInterface extends Interface {
  element: HTMLElement
  root: HTMLElement
  rootStyle: CSSStyleDeclaration
  init: (element?: HTMLElement) => void
}

export const Stage = new Interface(null, null as string | null) as StageInterface

// Public methods
Stage.init = (element: HTMLElement = document.body): void => {
  Stage.element = element

  Stage.root = document.querySelector(':root') as HTMLElement
  Stage.rootStyle = getComputedStyle(Stage.root)
}
