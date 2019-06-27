'use strict'

const findHandler = (type) => (h) =>
  new RegExp(`${type}|\\*`).test(h.type)

export default (channel) => (msg, handlers) => {

  const { type } = msg.properties
  const { handler } = handlers.find(
    findHandler(type)
  ) || {}

  if (handler) return handler(channel, msg)
  throw 'You need to specify handler for queue'
}
