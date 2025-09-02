import type { Resource } from '@/types/three'

export class ResourceManager {
  public static resources: Resource[] = []

  public static add(resource: Resource): void {
    ResourceManager.resources.push(resource)
  }

  public static has(name: string): boolean {
    return !!ResourceManager.resources.find((r: Resource) => r.name === name)
  }

  public static get(name: string): Resource {
    const resource = ResourceManager.resources.find((r: Resource) => r.name === name)

    if (resource) {
      return resource
    }

    throw new Error(`ResourceManager: Resource with name '${name}' was not found`)
  }

  public static clear() {
    ResourceManager.resources = []
  }
}
