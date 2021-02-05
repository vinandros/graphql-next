require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
// BD
connectDB();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // console.log(req.headers["authorization"]);
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        const { id } = user;
        return {
          userID: id,
        };
      } catch (error) {
        console.log("Something went wrong!!");
      }
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
