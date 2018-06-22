'use strict'

import amqplibSetup from '../src/index'

describe('CreateQueuesSpec', function() {

  let channel
  beforeEach(function() {
    channel = {
      assertQueue: sinon.stub()
    }
  })

  it('with empty queues', async function() {
    await amqplibSetup(channel)
    expect(channel.assertQueue).to.have.not.been.called
  })

  it('with 1 queue', async function() {

    const name = 'test.q'
    const options = { durable: true }
    const queues = [{ name, options }]
    await amqplibSetup(channel, { queues })
    expect(channel.assertQueue).to.have.been.calledWith(name, options)
  })

  it('with 2 queues', async function() {

    const name1 = 'test1.q'
    const opts1 = { deadLetterExchange: 'dead.ex' }

    const name2 = 'test2.q'
    const opts2 = {}

    const queues = [
      { name: name1, options: opts1 },
      { name: name2, options: opts2 }
    ]
    await amqplibSetup(channel, { queues })
    expect(channel.assertQueue).to.have.been.calledTwice
    expect(channel.assertQueue.firstCall).to.have.been.calledWith(name1, opts1)
    expect(channel.assertQueue.secondCall).to.have.been.calledWith(name2, opts2)
  })
})
