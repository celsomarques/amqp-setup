'use strict'

import Debug from 'debug'
import BPromise from 'bluebird'
import reduce from './reduce'
import wrapper from './wrapper'

const debug = Debug('amqplib-setup')

const consume = (channel, handlers) => (msg) =>
  wrapper(channel)(msg, handlers)

export default (channel, { consumers = [] }) => {

  const consumersMap = consumers.reduce(reduce, [])
  debug('Consumers map', consumersMap)

  const map = ({ name, handlers }) =>
    channel.consume(name, consume(channel, handlers))

  return BPromise.all(consumersMap.map(map))
}
