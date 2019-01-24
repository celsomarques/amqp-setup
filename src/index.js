'use strict'

import Debug from 'debug'
import { create as createExchanges } from './exchange.js'
import { create as createQueues, bind as bindQueues } from './queue'
import consumer from './consumer'

const debug = Debug('amqplib-setup')

export default async function setup(channel, opts = {}) {

  try {

    await createExchanges(channel, opts)
    await createQueues(channel, opts)
    await bindQueues(channel, opts)
    await consumer(channel, opts)

    debug('Setup was completed successfuly')

  } catch (err) {
    debug('Error in setup', err)
    throw err
  }
}
