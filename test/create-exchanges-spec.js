'use strict'

import AmqplibSetup from '../src/index'

describe('CreateExchangesSpec', function() {

  let channel
  beforeEach(function() {
    channel = {
      assertExchange: sinon.stub()
    }
  })

  it('with empty exchanges', async function() {
    await AmqplibSetup.setup(channel)
    expect(channel.assertExchange).to.have.not.been.called
  })

  it('with 1 direct exchange', async function() {

    const name = 'test.ex'
    const type = 'direct'
    const exchanges = [{ name, type }]
    await AmqplibSetup.setup(channel, { exchanges })
    expect(channel.assertExchange).to.have.been.calledWith(name, type)
  })

  it('with 1 direct and 1 fanout exchanges', async function() {

    const name1 = 'test1.ex'
    const type1 = 'direct'

    const name2 = 'test2.ex'
    const type2 = 'fanout'

    const exchanges = [
      { name: name1, type: type1 },
      { name: name2, type: type2 }
    ]
    await AmqplibSetup.setup(channel, { exchanges })
    expect(channel.assertExchange).to.have.been.calledTwice
    expect(channel.assertExchange.firstCall).to.have.been.calledWith(name1, type1)
    expect(channel.assertExchange.secondCall).to.have.been.calledWith(name2, type2)
  })
})
