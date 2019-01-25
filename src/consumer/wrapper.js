'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

const findHandler = (type) => (h) => type === h.type

export default (channel) => (msg, handlers) => {

  const { type } = msg.properties
  const { handler } = handlers.find(
    findHandler(type)
  ) || {}

  if (handler) return handler(channel, msg)
  throw 'You need to specify handler for queue'
}
