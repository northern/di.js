import { v4 as uuid } from 'uuid'
import Container from '../src'

class DummyService {
  public id: string

  constructor() {
    this.id = uuid()
  }
}

describe('Container:service', () => {
  it('should return a service that is a literal', () => {
    const container: Container = new Container()

    container.service('test-service', 'test')

    const result: string = container.get('test-service')
    
    expect(result).toBe('test')
  })

  it('should return a service that is an instance', () => {
    const container: Container = new Container()

    container.service('dummy-service', () => {
      return new DummyService()
    })

    const result: DummyService = container.get('dummy-service')

    expect(result).toBeInstanceOf(DummyService)
  })

  it('should return a service that is a none lazy instance', () => {
    const container: Container = new Container()

    const serviceProvider: Function = () => {
      return new DummyService()
    }

    container.service('dummy-service', serviceProvider, false)

    const result: DummyService = container.get('dummy-service')

    expect(result).toBeInstanceOf(DummyService)
  })

  it('should return the same service', () => {
    const container: Container = new Container()

    container.service('dummy-service', () => {
      return new DummyService()
    })

    const result1: DummyService = container.get('dummy-service')
    const result2: DummyService = container.get('dummy-service')

    expect(result1).toBeInstanceOf(DummyService)
    expect(result2).toBeInstanceOf(DummyService)
    expect(result1.id).toBe(result2.id)
  })

  it('should fail if a service already exists', () => {
    const container: Container = new Container()

    container.service('foo', 'bar')

    expect(() => container.service('foo', 'bar')).toThrow(Error)
  })

  it('should reregister a service if it already exists', () => {
    const container: Container = new Container()

    container.service('foo', 'bar')
    container.service('foo', 'baz', false, true)

    expect(container.get('foo')).toBe('baz')
  }) 
})

describe('Container:factory', () => {
  it('should return a service that is a literal', () => {
    const container: Container = new Container()

    container.service('test-service', 'test')

    const result: string = container.get('test-service')
    
    expect(result).toBe('test')
  })

  it('should return a service that is an instance', () => {
    const container: Container = new Container()

    container.service('dummy-service', () => {
      return new DummyService()
    })

    const result: DummyService = container.get('dummy-service')

    expect(result).toBeInstanceOf(DummyService)
  })

  it('should not return the same service', () => {
    const container: Container = new Container()

    container.factory('dummy-service', () => {
      return new DummyService()
    })

    const result1: DummyService = container.get('dummy-service')
    const result2: DummyService = container.get('dummy-service')

    expect(result1).toBeInstanceOf(DummyService)
    expect(result2).toBeInstanceOf(DummyService)
    expect(result1.id).not.toBe(result2.id)
  })

  it('should fail if a service already exists', () => {
    const container: Container = new Container()

    container.factory('foo', 'bar')

    expect(() => container.factory('foo', 'bar')).toThrow(Error)
  })
})

describe('Container:get', () => {
  it('should fail if a service does not exist', () => {
    const container: Container = new Container()

    expect(() => container.get('foo')).toThrow(Error)
  })
})
