export class EventManager {
  public listeners: { [name: string]: ((data?: any) => void)[] } = {}

  public addEventListener(name: string, listener: (arg?: any) => void): void {
    if (this.listeners[name] === undefined) this.listeners[name] = []

    if (!this.listeners[name].includes(listener)) {
      this.listeners[name].push(listener)
    }
  }

  public removeEventListener(name: string, listener: (arg?: any) => void): void {
    if (!Object.keys(this.listeners).length || !this.listeners[name]) {
      return
    }

    const index = this.listeners[name].indexOf(listener)

    if (index !== -1) this.listeners[name].splice(index, 1)
  }

  public dispatchEvent(name: string, data?: any): void {
    if (!Object.keys(this.listeners).length || !this.listeners[name]) return

    if (this.listeners[name].length > 0) {
      for (let i = 0; i < this.listeners[name].length; i++) {
        this.listeners[name][i].call(this, data)
      }
    }
  }

  public removeEvents(): void {
    this.listeners = {}
  }
}
