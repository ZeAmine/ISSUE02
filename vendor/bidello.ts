export interface BidelloTriggerOptions {
  name: string
  init?: boolean
}

export type BidelloHookType<T = (data?: any) => void> = T
export type BidelloDataType = { [name: string]: any }
export type BidelloInitType = { [name: string]: boolean }
export type BidelloListernerType = { [name: string]: ((data?: any) => void)[] }
export type BidelloConstructor<T = object> = new (...args: any) => T

class Bidello {
  private init: BidelloInitType = {}
  private data: BidelloDataType = {}
  private listeners: BidelloListernerType = {}
  private instances: any[] = []

  private on(e: string, f: BidelloHookType): void {
    this.listeners[e] = this.listeners[e] || []
    this.listeners[e].push(f)
  }

  private off(e: string, f: BidelloHookType): void {
    if (e in this.listeners) this.listeners[e].splice(this.listeners[e].indexOf(f), 1)
  }

  private nameToMethod(n: string): string {
    return `on${n.charAt(0).toUpperCase() + n.slice(1)}`
  }

  private fire(instance: any, name: string): void {
    const method = instance[this.nameToMethod(name)]

    if (typeof method === 'function') {
      method.call(instance, this.data[name])

      if (name === 'destroy') {
        instance.destroy()
      }
    }
  }

  public register(instance: any): void {
    this.instances.push(instance)

    for (const k in this.init) {
      this.fire(instance, k)
    }
  }

  public unregister(instance: any): void {
    const i = this.instances.indexOf(instance)

    if (i > -1) this.instances.splice(i, 1)
  }

  public trigger({ name, init = false }: BidelloTriggerOptions, data = {}): void {
    this.data[name] = data

    if (init) this.init[name] = init

    if (name in this.listeners) {
      for (let i = 0; i < this.listeners[name].length; i++) {
        this.listeners[name][i].call(this, data)
      }
    }

    this.instances.forEach((instance) => this.fire(instance, name))
  }

  public destroy() {
    for (const instance of this.instances) {
      this.unregister(instance)
    }

    this.init = {}
    this.data = {}
    this.listeners = {}
    this.instances = []
  }
}

const instance = new Bidello()

const Component = <T extends BidelloConstructor>(superclass: T) =>
  class extends superclass {
    constructor(...args: any) {
      super(...args)

      instance.register(this)
    }

    public destroy(): void {
      instance.unregister(this)
    }
  }

export { Component }
export default instance
