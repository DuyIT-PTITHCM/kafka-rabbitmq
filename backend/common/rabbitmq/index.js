const rabbitmq_connection = require('./connection');

module.exports = {
    connect: rabbitmq_connection.connect,
    // disconnect: rabbitmq_connection.disconnect,
    publish: require('./publish'),
    consumer: require('./consumer'),
};