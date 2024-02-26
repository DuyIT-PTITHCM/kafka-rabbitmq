const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka:9092', 'kafka1:9091', 'kafka3:9093']
});

const groupId = 'test-group';
const topic = 'my-topic';

const runConsumer = async (i) => {
    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                i,
                groupId,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

const run100Consumers = async () => {
    const consumerPromises = [];
    for (let i = 0; i < 100; i++) {
        consumerPromises.push(runConsumer(i));
    }
    await Promise.all(consumerPromises);
};

module.exports = run100Consumers;