/**
 * A simple Service Locator, a.k.a Dependency Injection Container (DIC).
 */
export default class Container {
  private services: Map<string, Function | any>

  constructor() {
    this.services = new Map()
  }

  /**
   * Register a new service. Use the "lazy" option to spawn the instance at
   * request time rather than initialization time.
   *
   * @param name The name of the service (must be unique)
   * @param provider A function or literal that returns or represents the service
   * @param lazy If the service is lazy loaded (only has meaning for function provider)
   * @param overwrite If set to true, it allows to overwrite an existing service
   */
  public service(name: string, provider: Function | any, lazy: boolean = true, overwrite: boolean = false): void {
    if (this.services.has(name) && !overwrite) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    if (provider instanceof Function) {
      if (lazy) {
        this.services.set(name, (container: Container) => {
          return this.services.set(name, provider.call(null, container))
        })
      } else {
        this.services.set(name, provider.call(null, this))
      }
    }
    else {
      this.services.set(name, provider)
    }
  }

  /**
   * Register a factory. A factory always returns a new instance.
   *
   * @param name The name of the factory (must be unique)
   * @param provider A function that returns the factory instance
   * @param overwrite If set to true, it allows to overwrite an existing service
   */
  public factory(name: string, provider: Function | any, overwrite: boolean = false): void {
    if (this.services.has(name) && !overwrite) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    this.services.set(name, provider)
  }

  /**
   * Returns an instance of the service or factory.
   *
   * @param name The name of the service or factory to get the instance of.
   */
  public get(name: string): any {
    if (!this.services.has(name)) {
      throw new Error(`Service with name '${name}' does not exist.`)
    }

    const service: any = this.services.get(name)

    if (service instanceof Function) {
      const result: any = service.call(null, this)

      // If the service is lazy, then first trigger the registration of the
      // service and then 'get' it again to return it's value.
      if ('get' in result) {
        return result.get(name)
      }
      
      return result
    }

    return service
  }
}
