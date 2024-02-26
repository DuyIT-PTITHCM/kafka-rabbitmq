const amqp = require('amqplib');

async function connect() {
    const config = {
        protocol: process.env.AMQP_PROTOCOL ? process.env.AMQP_PROTOCOL : "amqp",
        hostname: process.env.AMQP_HOSTNAME ? process.env.AMQP_HOSTNAME : "localhost",
        port: process.env.AMQP_PORT ? parseInt(process.env.AMQP_PORT, 10) : 5672,
        username: process.env.AMQP_USERNAME ? process.env.AMQP_USERNAME : "guest",
        password: process.env.AMQP_PASSWORD ? process.env.AMQP_PASSWORD : "guest",
        heartbeat: process.env.AMQP_HEARTBEATS ? parseInt(process.env.AMQP_HEARTBEATS,10) : 300,
        vhost: process.env.AMQP_VHOST ? process.env.AMQP_VHOST : ""
    };    
    return await amqp.connect(config);
}

module.exports.connect = connect;