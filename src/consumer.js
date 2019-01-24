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

  if (handlerObj) return handlerObj.handler(msg)
  throw 'You need to specify handler for queue'
}

export default function(channel, { consumers = [] }) {

  const consumersMap = consumers.reduce(_reduce, [])
  debug('Consumers map', consumersMap)

  const map = ({ name, handlers }) => channel.
    consume(name, (msg) => _wrapper.apply(channel, msg, handlers))

  return BPromise.all(consumersMap.map(map))
}
