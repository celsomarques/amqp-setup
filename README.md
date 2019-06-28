## Usage


*exchanges.json*

```
[
  {
    "name": "person.ex",
    "type": "fanout"
  }
]
```


*queues.json*

```
[
  {
    "name": "person.q",
    "options": { "deadLetterExchange": "person.dead.ex" }
  },
  { "name": "person.manual-reprocess.q" }
]
```


*bindings.json*

```
[
  { "exchange": "person.ex", "queue": "person.q" },
  { "exchange": "person.dead.ex", "queue": "person.manual-reprocess.q" }
]
```


*person/broker/config.js*

```
'use strict'

import exchanges from './exchanges.json'
import queues from './queues.json'
import bindings from './bindings.json'
import handler from 'app/v1/person/handler'

const consumers = [
  {
    type: '*',
    name: 'person.q',
    handler: handler
  }
]

export default { exchanges, queues, bindings, consumers }
```


*channel.js*

```
'use strict'

import amqplibSetup from 'amqplib-setup'
import * as amqp from 'amqp-connection-manager'
import personConfig from 'app/v1/person/broker/config'

const opts = {
 heartbeatIntervalInSeconds: 30,
 reconnectTimeInSeconds: 1
}
const rabbit = amqp.connect([process.env.RABBITMQ_URL], opts)

const setup = async(channel) => {

  channel.prefetch(parseInt(process.env.RABBITMQ_PREFETCH))

  try {
    await amqplibSetup(channel, personConfig)
    logger.info('Broker was started successfully')
  } catch (err) {
    logger.error('Failed to start broker', err)
  }
}

export default rabbit.createChannel({ json: true, setup })
```
