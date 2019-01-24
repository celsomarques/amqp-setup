'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'

const debug = Debug('amqplib-setup')

const create = (channel, { exchanges = [] }) => {
  debug('Creating exchanges', exchanges)
  const map = (ex) => channel.assertExchange(ex.name, ex.type)
  return BPromise.all(exchanges.map(map))
}

export { create }
