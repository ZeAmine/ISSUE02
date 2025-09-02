interface GridOptions {
  col: number;
}

export class Grid {
  private readonly col: number
  private inDom: boolean
  private gW: HTMLDivElement | null

  constructor(options: GridOptions) {
    this.col = options.col
    this.inDom = false
    this.gW = null

    this.key = this.key.bind(this)
    document.addEventListener('keydown', this.key)
  }

  private key(e: KeyboardEvent): void {
    if (e.code === 'Escape' && this.inDom) {
      this.click({ escape: true })
    } else if (e.code === 'KeyG' && e.shiftKey) {
      this.click({ escape: false })
    }
  }

  click(options: { escape: boolean }): void {
    if ((this.gW && this.inDom) || options.escape) {
      this.remove()
    } else {
      this.add()
    }
  }

  private remove(): void {
    if (this.gW && this.gW.parentNode) {
      this.gW.parentNode.removeChild(this.gW)
      this.inDom = false
    }
  }

  private add(): void {
    this.gW = document.createElement('div')
    this.gW.className = 'grid'

    const innerDiv = document.createElement('div')
    innerDiv.className = 'grid-wrapper'

    for (let i = 0; i < this.col; i++) {
      const columnDiv = document.createElement('div')
      innerDiv.appendChild(columnDiv)
    }

    this.gW.appendChild(innerDiv)
    document.getElementById('__nuxt')?.prepend(this.gW)
    this.inDom = true
  }
}
