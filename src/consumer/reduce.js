'use strict'

import Debug from 'debug'

const debug = Debug('amqplib-setup')

const findQueue = ({ name }) => (q) => q.name === name
const createHandler = (consumer) => ({
  type: consumer.type || '',
  handler: consumer.handler
})

export default (acc, cur) => {

  const queue = acc.find(
    findQueue(cur)
  )
  const handler = createHandler(cur)
  if (!queue) {
    debug('New queue', cur.name, handler)
    acc.push({ name: cur.name, handlers: [handler] })
    return acc
  }
  queue.handlers.push(handler)
  debug('Update queue', cur.name, queue.handlers)
  return acc
}
