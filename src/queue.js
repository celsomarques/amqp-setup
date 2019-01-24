'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

const create = (channel, opts = {}) => {
  const { queues = [] } = opts
  debug('Creating queues', queues)
  const map = (q) => channel.assertQueue(q.name, q.options)
  return BPromise.all(queues.map(map))
}

const bind = (channel, opts = {}) => {

  const { bindings = [] } = opts
  debug('Creating bindings', bindings)
  const map = (bind) => channel.bindQueue(
    bind.queue,
    bind.exchange,
    bind.pattern
  )
  return BPromise.all(bindings.map(map))
}

export { create, bind }
