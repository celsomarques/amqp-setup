'use strict'

import amqplibSetup from '../../src/index'

describe('ExchangeSpec', function() {

  let channel
  beforeEach(function() {
    channel = {
      assertExchange: jest.fn()
    }
  })

  describe('.create', function() {

    test('with empty exchanges', async function() {
      await amqplibSetup(channel)
      expect(channel.assertExchange).not.toHaveBeenCalled()
    })

    test('with 1 direct exchange', async function() {

      const name = 'test.ex'
      const type = 'direct'
      const exchanges = [{ name, type }]
      await amqplibSetup(channel, { exchanges })
      expect(channel.assertExchange).toHaveBeenCalledWith(name, type)
    })

    test('with 1 direct and 1 fanout exchanges', async function() {

      const name1 = 'test1.ex'
      const type1 = 'direct'

      const name2 = 'test2.ex'
      const type2 = 'fanout'

      const exchanges = [
        { name: name1, type: type1 },
        { name: name2, type: type2 }
      ]
      await amqplibSetup(channel, { exchanges })
      expect(channel.assertExchange).toHaveBeenCalledTwice
      expect(channel.assertExchange).toHaveBeenNthCalledWith(1, name1, type1)
      expect(channel.assertExchange).toHaveBeenNthCalledWith(2, name2, type2)
    })
  })
})
