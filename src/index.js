'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

function _createExchanges(channel, { exchanges = [] }) {
  debug('Creating exchanges', exchanges)
  const map = (ex) => channel.assertExchange(ex.name, ex.type)
  return BPromise.all(exchanges.map(map))
}

function _createQueues(channel, { queues = [] }) {
  debug('Creating queues', queues)
  const map = (q) => channel.assertQueue(q.name, q.options)
  return BPromise.all(queues.map(map))
}

function _bindQueues(channel, { bindings = [] }) {
  debug('Creating bindings', bindings)
  const map = (bind) => channel.bindQueue(bind.queue, bind.exchange)
  return BPromise.all(bindings.map(map))
}

function _consumerWrapper(msg, handlers) {

  const { type } = msg.properties
  let handlerObj = handlers.find((h) => type === h.type)

  if (!handlerObj) throw 'You need to specify handler for queue'
  const handler = handlerObj.handler.bind(this)
  handler(msg)
}

function _consumer(channel, { consumers = [] }) {

  const consumersMap = consumers.reduce(function(acc, cur) {
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

  }, [])

  debug('Consumers map', consumersMap)
  const wrapper = _consumerWrapper.bind(channel)
  const map = function({ name, handlers }) {
    return channel.consume(name, (msg) => wrapper(msg, handlers))
  }
  return BPromise.all(consumersMap.map(map))
}

async function setup(channel, opts = {}) {

  try {

    await _createExchanges(channel, opts)
    await _createQueues(channel, opts)
    await _bindQueues(channel, opts)
    await _consumer(channel, opts)

    debug('Setup was completed successfuly')

  } catch (err) {
    debug('Error in setup', err)
    throw err
  }
}

export default { setup }
