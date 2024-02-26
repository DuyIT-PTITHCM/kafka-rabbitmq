const amqp = require('amqplib/callback_api');
const express = require('express');
const rabbitmq = require('./common/rabbitmq');
const app = express();
const port = 3000;
require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'] // Kafka broker address
});

const producer = kafka.producer();

const sendMessage = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'my-topic',
      messages: [
        { value: 'Hello KafkaJS!' }
      ]
    });
    await producer.disconnect();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const consumer = kafka.consumer({ groupId: 'test-group' });

const runConsumer = async () => {
  try {
    await consumer.connect(); 
    await consumer.subscribe({ topic: 'my-topic' });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
      },
    });
  } catch (error) {
    console.error('Error running consumer:', error);
  }
};

// Run producer and consumer
sendMessage().catch(console.error);
runConsumer().catch(console.error);



// Connect to RabbitMQ
// amqp.connect('amqp://rabbitmq', function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }

//   // Create channel
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }

//     console.log('Connected to RabbitMQ');

//     // Consume messages from queue
//     channel.consume('queueA', function (message) {
//       if (message !== null) {
//         console.log('Received message from queueA:'  + message.content.toString());
//         channel.ack(message);
//       }
//     });
//     channel.consume('queueB', function (message) {
//       if (message !== null) {
//         console.log('Received message from queueB:');
//         channel.ack(message);
//       }
//     });
//     channel.consume('queueC', function (message) {
//       if (message !== null) {
//         console.log('Received message from queueC:');
//         channel.ack(message);
//       }
//     });
//     channel.consume('queueD', function (message) {
//       if (message !== null) {
//         console.log('Received message from queueD:' + message.content);
//         channel.ack(message);
//       }
//     });

//     channel.assertQueue('hello', {
//       durable: false
//     }, function(error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       console.log('Queue \'hello\' is ready');
//     });

//     channel.consume('hello', function (message) {
//       if (message !== null) {
//         console.log('Received message from hello:');
//         channel.ack(message);
//       }
//     });

//     // Define route for sending message to RabbitMQ
//     let exchange = 'topic_logs';

//     // Khai báo exchange loại topic
//     channel.assertExchange(exchange, 'topic', {
//       durable: false
//     });

//     // Routing key 1
//     let routingKey1 = 'key1';
//     let queueA = 'queueA';
//     let queueB = 'queueB';

//     // Tạo hàng đợi A và bind với routing key 1
//     channel.assertQueue(queueA, {
//       exclusive: false
//     }, function (error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       channel.bindQueue(q.queue, exchange, routingKey1);
//     });

//     // Tạo hàng đợi B và bind với routing key 1
//     channel.assertQueue(queueB, {
//       exclusive: false
//     }, function (error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       channel.bindQueue(q.queue, exchange, routingKey1);
//     });

//     // Routing key 2
//     let routingKey2 = 'key2';
//     let queueC = 'queueC';
//     let queueD = 'queueD';

//     // Tạo hàng đợi C và bind với routing key 2
//     channel.assertQueue(queueC, {
//       exclusive: false
//     }, function (error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       channel.bindQueue(q.queue, exchange, routingKey2);
//     });

//     // Tạo hàng đợi D và bind với routing key 2
//     channel.assertQueue(queueD, {
//       exclusive: false
//     }, function (error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       channel.bindQueue(q.queue, exchange, routingKey2);
//     });

//     channel.assertQueue(queueD, {
//       exclusive: false
//     }, function (error2, q) {
//       if (error2) {
//         throw error2;
//       }
//       channel.bindQueue(q.queue, exchange, routingKey1);
//     });

//     // Define route for sending message to RabbitMQ with topic
//     app.get('/send-message', (req, res) => {
//       channel.publish(exchange, routingKey1, Buffer.from('Message with routing key 1'));
//       channel.publish(exchange, routingKey2, Buffer.from('Message with routing key 2'));
//       res.send(`Sent to RabbitMQ`);
//     });

//     app.get('/send-message-fanout', (req, res) => {
//       const message = 'Hello from Fanout Exchange!';
//       // Khai báo Fanout Exchange
//       const exchange = 'fanout_exchange';

//       channel.assertExchange(exchange, 'fanout', {
//         durable: false
//       });

//       channel.assertQueue('queueA', {
//         exclusive: false
//       }, function (error2, q) {
//         if (error2) {
//           throw error2;
//         }
//         channel.bindQueue(q.queue, 'fanout_exchange','');
//       });

//       channel.assertQueue('queueD', {
//         exclusive: false
//       }, function (error2, q) {
//         if (error2) {
//           throw error2;
//         }
//         channel.bindQueue(q.queue, 'fanout_exchange','');
//       });

//       // Gửi tin nhắn đến Fanout Exchange
//       channel.publish(exchange, '', Buffer.from(message));

//       // console.log(" [x] Sent %s", message);
//       res.send('Message sent to Fanout Exchange!');
//     });

//   });
// });

// (async () => {
//   const rabbitmq_connection = await rabbitmq.connect();
//   await rabbitmq.publish(rabbitmq_connection, 'hello_duy', 'Hello anh duy');
//   await rabbitmq_connection.close();

// })();

// (async () => {
//   const rabbitmq_connection = await rabbitmq.connect();
//   await rabbitmq.consumer(rabbitmq_connection, 'hello_duy', work);
//   await rabbitmq_connection.close();

// })();

// async function work(data) {
//   console.log(data);
// }
// Khởi tạo Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9093'] // Địa chỉ Kafka broker
});

console.log(kafka);


// Group ID cho Kafka Consumer
const groupId = 'my-consumer-group';

// Producer
const producer = kafka.producer();

// Khởi tạo producer và gửi tin nhắn
const sendMessage = async () => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'my-topic',
      messages: [
        { value: 'Hello KafkaJS!' }
      ]
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
};


// (async () => {
//   // Consumer
//   const consumer = kafka.consumer({ groupId: groupId });
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log('Received message:', {
//         value: message.value.toString(),
//       });
//     },
//   });
// })();

// Khởi chạy producer khi ứng dụng được bắt đầu
sendMessage().catch(console.error);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
