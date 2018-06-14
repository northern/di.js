
export default class Container {
  constructor() {
    this.services = {}
  }

  service(name, callback, lazy = false) {
    if (this.services[name]) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    if (lazy) {
      this.services[name] = (container) => {
        return this.services[name] = callback.call(null, container)
      }
    }
    else {
      this.services[name] = callback.call(null, this)
    }
  }

  factory(name, callback) {
    if (this.services[name]) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    this.services[name] = callback
  }

  get(name) {
    if (!this.services[name]) {
      throw new Error(`Service with name '${name}' does not exist.`)
    }

    const service = this.services[name]

    if (service instanceof Function) {
      return service.call(null, this)
    }

    return service
  }
}
