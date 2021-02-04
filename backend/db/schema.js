const { gql } = require("apollo-server");
// Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    surname: String
    email: String
    createdAt: String
  }
  type Query {
    getCourse: String
  }
  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }
  type Mutation {
    newUser(input: UserInput): User
  }
`;

module.exports = typeDefs;
