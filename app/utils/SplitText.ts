import { SplitText as GSAPSplit } from 'gsap/SplitText'
import SplitType from 'split-type'

export class SplitText {
  private static readonly SPLIT_TYPE_REGEX = /^st-(?:t-)?(c|w|l|lc|lw)$/

  public static split(element: HTMLElement): HTMLElement[] | null {
    const splitClass = Array.from(element.classList).find((cls: string) =>
      cls.match(SplitText.SPLIT_TYPE_REGEX)
    )

    if (!splitClass) return this.splitLine(element)

    const splitType = splitClass.replace(/^st-(?:t-)?/, '')

    switch (splitType) {
      case 'c':
        return this.splitChar(element)
      case 'w':
        return this.splitWord(element)
      case 'l':
        return this.splitLine(element)
      case 'lc':
        return this.splitLineChar(element)
      case 'lw':
        return this.splitLineWord(element)
      default:
        return this.splitLine(element)
    }
  }

  private static splitChar(el: HTMLElement): HTMLElement[] {
    const wrapper = new SplitType(el, {
      types: 'chars',
      tagName: 'span',
      charClass: 'c_'
    }).chars as HTMLElement[]

    const inner = new SplitType(wrapper, {
      types: 'chars',
      tagName: 'span',
      charClass: 'c'
    }).chars as HTMLElement[]

    cleanupElements(wrapper, inner)
    return inner
  }

  private static splitWord(el: HTMLElement): HTMLElement[] {
    const wrapper = new SplitType(el, {
      types: 'words',
      tagName: 'span',
      wordClass: 'w_'
    }).words as HTMLElement[]

    const inner = new SplitType(wrapper, {
      types: 'words',
      tagName: 'span',
      wordClass: 'w'
    }).words as HTMLElement[]

    cleanupElements(wrapper, inner)
    return inner
  }

  // private static splitLine(el: HTMLElement): HTMLElement[] {
  //   const wrapper = GSAPSplit.create(el, {
  //     type: 'lines',
  //     tagName: 'span',
  //     linesClass: 'l_',
  //     aria: 'none',
  //     autoSplit: true
  //   }).lines as HTMLElement[]

  //   const inner = GSAPSplit.create(wrapper, {
  //     type: 'lines',
  //     tagName: 'span',
  //     linesClass: 'l',
  //     aria: 'none',
  //     autoSplit: true
  //   }).lines as HTMLElement[]

  //   this.cleanupElements(wrapper, inner)
  //   return inner
  // }

  private static splitLine(el: HTMLElement): HTMLElement[] {
    const wrapper = new SplitType(el, {
      types: 'lines',
      tagName: 'span',
      lineClass: 'l_'
    }).lines as HTMLElement[]

    const inner = new SplitType(wrapper, {
      types: 'lines',
      tagName: 'span',
      lineClass: 'l'
    }).lines as HTMLElement[]

    cleanupElements(wrapper, inner)
    return inner
  }

  private static splitLineChar(el: HTMLElement): HTMLElement[] {
    const lines = new SplitType(el, {
      types: 'lines',
      tagName: 'span',
      lineClass: 'l_'
    }).lines as HTMLElement[]

    const chars: HTMLElement[] = []
    lines.forEach((line: HTMLElement) => {
      const lineChars = new SplitType(line, {
        types: 'chars',
        tagName: 'span',
        charClass: 'c_ c'
      }).chars as HTMLElement[]
      chars.push(...lineChars)
    })

    cleanupElements(lines, chars)
    return chars
  }

  private static splitLineWord(el: HTMLElement): HTMLElement[] {
    const lines = new SplitType(el, {
      types: 'lines',
      tagName: 'span',
      lineClass: 'l_'
    }).lines as HTMLElement[]

    const words: HTMLElement[] = []
    lines.forEach((line: HTMLElement) => {
      const lineWords = new SplitType(line, {
        types: 'words',
        tagName: 'span',
        wordClass: 'w'
      }).words as HTMLElement[]
      words.push(...lineWords)
    })

    cleanupElements(lines, words)
    return words
  }

  private static cleanupElements(wrapper: HTMLElement[], inner?: HTMLElement[] | null): void {
    wrapper?.forEach((el: HTMLElement) => {
      el.removeAttribute('style')
      el.parentElement?.removeAttribute('style')
    })
    inner?.forEach((el: HTMLElement) => {
      el.removeAttribute('style')
    })
  }
}

function cleanupElements(wrapper: HTMLElement[], inner?: HTMLElement[]): void {
  const cleanup = (elements: HTMLElement[]) => {
    elements.forEach((el) => {
      el.removeAttribute('style')
      // el.children[0]?.removeAttribute('style')
      el.parentElement?.removeAttribute('style')
    })
  }
  cleanup(wrapper)
  if (inner) cleanup(inner)
}
