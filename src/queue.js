'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

const create = (channel, { queues = [] }) => {
  debug('Creating queues', queues)
  const map = (q) => channel.assertQueue(q.name, q.options)
  return BPromise.all(queues.map(map))
}

const bind = (channel, { bindings = [] }) => {
  debug('Creating bindings', bindings)
  const map = (bind) => channel.bindQueue(bind.queue, bind.exchange)
  return BPromise.all(bindings.map(map))
}

export { create, bind }
