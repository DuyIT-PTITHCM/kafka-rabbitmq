async function publish(connection, queue_name, msg) {
    const channel = await connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
    });

    const assertQueueOptions = {
        durable: false
    };

    const queueMaxPriority = process.env.MAX_PRIORITY ? parseInt(process.env.MAX_PRIORITY, 10) : 0;
    if (queueMaxPriority) {
        assertQueueOptions.maxPriority = queueMaxPriority;
    }

    await channel.assertQueue(queue_name, assertQueueOptions);
    await channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(msg)), {
        persistent: true
    });
    console.log(" [x] Sent '%s' to '%s'", JSON.stringify(msg), queue_name);
    await channel.close();
}

module.exports = publish;