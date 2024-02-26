const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
    deleteUser(id: ID!): User
  }

  type User {
    id: ID
    name: String
    email: String
  }

  input UserInput {
    name: String
    email: String
  }
`);

module.exports = schema;