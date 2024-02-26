async function consumer(connection, queue_name, work) {
    if (!connection || !queue_name || !work) {
        return ;
    }
    const consumerQueueOptions = {
        noAck: false
    };

    const assertQueueOptions = {
        durable: false
    };

    const queueMaxPriority = process.env.MAX_PRIORITY ? parseInt(process.env.MAX_PRIORITY, 10) : 0;
    if (queueMaxPriority) {
        assertQueueOptions.maxPriority = queueMaxPriority;
    }

    const channel = await connection.createChannel();
    const queue   = await channel.assertQueue(queue_name, assertQueueOptions);
    await channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);
    await channel.consume(queue.queue, async (msg) => {
        console.log(" [x] Received %s", msg.content);
        const is_processed = await work(JSON.parse(msg.content));
        if (is_processed) {
            channel.ack(msg);
        } else {
            channel.nack(msg);
        }
    }, consumerQueueOptions);
}

module.exports = consumer;
