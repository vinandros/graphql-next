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
  type Client {
    id: ID
    name: String
    surname: String
    company: String
    email: String
    phone: String
    createdAt: String
    salesman: ID
  }
  #Queries================================================================= #
  type Query {
    #Users
    getUser(token: String!): User

    #Products
    getProducts: [Product]
    getProduct(id: ID!): Product

    #Clients
    getClients: [Client]
    getSalesmanClients: [Client]
    getClient(id: ID!): Client
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

  input ClientInput {
    name: String!
    surname: String!
    company: String!
    email: String!
    phone: String
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

    # Clients
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deleteClient(id: ID!): String
  }
`;

module.exports = typeDefs;
