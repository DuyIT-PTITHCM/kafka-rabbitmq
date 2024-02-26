const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092', 'kafka1:9091', 'kafka3:9093']
});

const producer = kafka.producer()

const runProducer = async (topic, message) => {
    await producer.connect()
    await producer.send({
        topic: topic,
        messages: [
            { value: message },
        ],
    })
};

module.exports = runProducer;

