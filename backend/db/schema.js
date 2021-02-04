const { gql } = require("apollo-server");
// Schema
const typeDefs = gql`
  #Types================================================================= #
  type User {
    id: ID
    name: String
    surname: String
    email: String
    createdAt: String
  }
  type Token {
    token: String
  }
  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    createdAt: String
  }
  #Queries================================================================= #
  type Query {
    #Users
    getUser(token: String!): User

    #Products
    getProducts: [Product]
    getProduct(id: ID!): Product
  }
  #Inputs================================================================== #
  input UserInput {
    name: String!
    surname: String!
    email: String!
    password: String!
  }
  input AuthenticationInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }
  #Mutations===================================================================== #
  type Mutation {
    # Users
    newUser(input: UserInput): User
    userAuthentication(input: AuthenticationInput): Token

    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
