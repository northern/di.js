# DI

A simple Dependency Injection container for JavaScript.

## Install

Either use npm:

    npm install @northern/di

or Yarn:

    yarn add @northern/di

## Introduction

To use DI in your application simply import (or require) the `Container` and create a `Container` instance:
````
import Container from '@northern/di'

const container = new Container()
````
With the newly instantiated container, you can start registering services. There are two ways you can register a service, the "service" method and/or the "factory" method.

## Registering a service

With the `service` method a new service provider can be registered. The `service` method takes three parameters:

    Container.service(name, provider[, lazy = false])

The `name` is a string with the "name" of the service, e.g. `'logger'`. The `provider` is a function that "returns" the service instance. The `lazy` parameter specifies whether the service is "lazy" or not, more on that later.

A "service" instance is only ever created once (as opposed to a factory, which returns a new instance each time). Let's look at a simple service registration process:
````
class Logger {
  info(message) {
    console.log(message)
  }
}

container.service('logger', container => {
  return new Logger()
})

````
It's that simple. We can now get the "logger" by using the `get` method on the container:

    const logger = container.get('logger')
   
    logger.info("Hello DI")

Since the `Container` instance is passed into the service provider, it is possible to "wire" multiple services together. I.e. a service provider can use prior registered services and "inject" them into other services. E.g. if we register a service then we can pass the `logger` to that service:
````
class PaymentService {
  constructor(logger) {
    this.logger = logger
  }

  process(paymentObject) {
    this.logger.info("Starting payment process.")
  }
}

container.service('payment', container => {
  const logger = container.get('logger')

  const service = new PaymentService(logger)

  return service
})

const paymentService = container.get('payment')
paymentService.process({...})
````

### Lazy services

When a service is not "lazy" then the instance of that service will be created the moment the service is registered (i.e. when the `service` method is called). This is not always desireable. E.g. if the dependency graph is large and not all services are always used, i.e. usage depends of the code path of the application, it might be better to instantiate a service on a need by need basis. This what a "lazy" service does; it's instance is created on request time rather than registration time.

To create a lazy service, simply pass the 3rd parameter of the `service` method as `true`.

## Registering a factory

With the `factory` method a new factory provider can be created. A factory will always return a new instance each time it is requested from the container. The factory registration is the same as that of a service except that a factory cannot be lazy. I.e. the `factory` method only has two parameters:

    Container.factory(name, provider)

That's it.
