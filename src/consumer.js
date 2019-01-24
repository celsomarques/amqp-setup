'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

const _reduce = (acc, cur) => {

  const queue = acc.find((q) => q.name === cur.name)
  const handler = { type: cur.type || '', handler: cur.handler }
  if (!queue) {
    debug('New queue', cur.name, handler)
    acc.push({ name: cur.name, handlers: [handler] })
    return acc
  }
  queue.handlers.push(handler)
  debug('Update queue', cur.name, queue.handlers)
  return acc
}

const _wrapper = (msg, handlers) => {

  const { type } = msg.properties
  const handlerObj = handlers.find((h) => type === h.type)

  if (!handlerObj) throw 'You need to specify handler for queue'
  const handler = handlerObj.handler.bind(this)
  handler(msg)
}

export default (channel, { consumers = [] }) => {

  const wrapper = _wrapper.bind(channel)
  const consumersMap = consumers.reduce(_reduce, [])
  debug('Consumers map', consumersMap)

  const map = ({ name, handlers }) => channel.
    consume(name, (msg) => wrapper(msg, handlers))

  return BPromise.all(consumersMap.map(map))
}
