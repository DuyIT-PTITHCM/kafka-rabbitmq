const express = require('express');
const bodyParser = require('body-parser');
const schema = require('./graphql/schema');
const root = require('./graphql/root');
const { graphqlHTTP } = require('express-graphql');
const runProducer = require('./common/kafka/producer');
const run100Consumers = require('./common/kafka/consumer');

const app = express();
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

run100Consumers();

app.post('/send-message', async (req, res) => {
  const { message, message2, message3 } = req.body;

  try {
    runProducer('my-topic', message).catch(console.error);
    runProducer('my-topic', message2).catch(console.error);
    runProducer('my-topic', message3).catch(console.error);

    res.status(200).json({ message: 'Message sent to Kafka successfully' });

  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server đang chạy tại http://localhost:3000');
});
