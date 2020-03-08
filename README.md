# DI

A simple Dependency Injection container for JavaScript & TypeScript.

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
With the newly instantiated container, you can start registering services. There are two ways you can register a service, either use the `service` method or you can use the `factory` method.

## Registering a service

With the `service` method a new service provider can be registered. The `service` method takes three parameters:

    Container.service(name, provider[, lazy = true, overwrite = false])

The `name` is a string with the "name" of the service, e.g. `logger`. The `provider` is a function that, when called, "returns" the service instance. The `lazy` parameter specifies whether the service is "lazy" or not, more on that later and the `overwrite` parameter allows you to re-register a service if it already exists in the service registry of the container (handy during integration tests when you want to swap a service with a mock).

A "service" instance is only ever created once (as opposed to a factory, which returns a new instance of the service each time).

Let's look at a simple service registration example:
````
class Logger {
  info(message) {
    console.info(message)
  }
}

container.service('logger', container => {
  return new Logger()
})
````
It's that simple. We can now get the "logger" service by using the `get` method on the container:
````
const logger = container.get('logger')

logger.info("Hello DI")
````
Since the `Container` instance is passed into the service provider, it is possible to "wire" multiple services together (i.e. create service dependencies by having one service require another already registered service). A service provider can use already registered services and "inject" them into other services. E.g. if we register a service then we can pass an instance of the `logger` service into that other service:
````
class PaymentService {
  constructor(logger) {
    this.logger = logger
  }

  processPayment(paymentObject) {
    this.logger.info("Starting payment process.")
  }
}

container.service('paymentService', container => {
  const logger = container.get('logger')

  const service = new PaymentService(logger)

  return service
})

const paymentService = container.get('paymentService')
paymentService.processPayment({ ... })
````

### Lazy services

When a service is not "lazy" then the instance of that service will be created the moment the service is registered (i.e. when the `service` method is called). This is not usually desireable (and why `lazy` by default is `true`). E.g. if the dependency graph is large and not all services are always used, i.e. usage depends of the code path of the application, it might be better to instantiate a service on a need by need basis. This what a "lazy" service does; the instance is created the first time the service is requested rather than when the service was registered.

## Registering a factory

With the `factory` method a new factory provider can be created. A factory will always return a new instance each time it is requested from the container. The factory registration is the same as that of a service except that a factory cannot be lazy (i.e. its always lazy).

The `factory` method only has three parameters:

    Container.factory(name, provider[, overwrite = false])

That's it. Have fun wiring!
