'use strict'

import { create, bind } from '../../src/queue'

describe('QueueSpec', function() {

  let channel
  beforeEach(function() {
    channel = {
      assertQueue: jest.fn(),
      bindQueue: jest.fn()
    }
  })

  describe('.create', function() {

    test('with empty queues', async function() {
      await create(channel)
      expect(channel.assertQueue).not.toHaveBeenCalled()
    })

    test('with 1 queue', async function() {

      const name = 'test.q'
      const options = { durable: true }
      const queues = [{ name, options }]
      await create(channel, { queues })
      expect(channel.assertQueue).toHaveBeenCalledWith(name, options)
    })

    test('with 2 queues', async function() {

      const name1 = 'test1.q'
      const opts1 = { deadLetterExchange: 'dead.ex' }

      const name2 = 'test2.q'
      const opts2 = {}

      const queues = [
        { name: name1, options: opts1 },
        { name: name2, options: opts2 }
      ]
      await create(channel, { queues })
      expect(channel.assertQueue).toHaveBeenCalledTimes(2)
      expect(channel.assertQueue).toHaveBeenNthCalledWith(1, name1, opts1)
      expect(channel.assertQueue).toHaveBeenNthCalledWith(2, name2, opts2)
    })
  })

  describe('.bind', function() {

    test('with empty bindings', async function() {
      await bind(channel)
      expect(channel.bindQueue).not.toHaveBeenCalled()
    })

    test('with 1 bindings', async function() {

      const queue = 'test.q'
      const exchange = 'test.ex'
      const pattern = 'routing.key'
      const bindings = [
        { queue, exchange, pattern }
      ]
      await bind(channel, { bindings })
      expect(channel.bindQueue).toHaveBeenCalledWith(
        queue,
        exchange,
        pattern
      )
    })

    test('with 2 bindings', async function() {

      const queue1 = 'test1.q'
      const exchange1 = 'test1.ex'
      const pattern1 = 'routing.key.1'

      const queue2 = 'test2.q'
      const exchange2 = 'test2.ex'
      const pattern2 = 'routing.key.2'

      const bindings = [
        { queue: queue1, exchange: exchange1, pattern: pattern1 },
        { queue: queue2, exchange: exchange2, pattern: pattern2 }
      ]
      await bind(channel, { bindings })
      expect(channel.bindQueue).toHaveBeenCalledTwice
      expect(channel.bindQueue).toHaveBeenNthCalledWith(
        1,
        queue1,
        exchange1,
        pattern1
      )
      expect(channel.bindQueue).toHaveBeenNthCalledWith(
        2,
        queue2,
        exchange2,
        pattern2
      )
    })
  })
})
