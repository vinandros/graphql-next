require("dotenv").config();
const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { id, name, surname } = user;
  return jwt.sign({ id, name, surname }, secret, { expiresIn });
};
// Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userID = await jwt.verify(token, process.env.JWT_SECRET);
      return userID;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }) => {
      //check if product exist
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not founded.");
      }
      return product;
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getSalesmanClients: async (_, {}, ctx) => {
      const { userID } = ctx;
      try {
        const clients = await Client.find({ salesman: userID });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const { userID } = ctx;
      const client = await Client.findOne({ _id: id });

      if (!client) {
        throw new Error("Client does not exist.");
      }

      if (userID !== client.salesman.toString()) {
        throw new Error("Access denied");
      }

      return client;
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password } = input;
      // Check if user exist
      const userExist = await User.findOne({ email });
      if (userExist) {
        throw new Error("User ready exist");
      }

      // Hash password

      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt);
      try {
        // Save user
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    userAuthentication: async (_, { input }) => {
      const { email, password } = input;

      // check user exist
      const userExist = await User.findOne({ email });

      if (!userExist) {
        throw new Error("User not exist");
      }
      // check password
      const passwordOk = await bcryptjs.compare(password, userExist.password);
      if (!passwordOk) {
        throw new Error("Password is wrong");
      }
      // create token
      return {
        token: createToken(userExist, process.env.JWT_SECRET, "24h"),
      };
    },
    newProduct: async (_, { input }) => {
      try {
        const newProduct = new Product(input);
        const product = await newProduct.save();
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not founded.");
      }
      updatedproduct = await Product.findByIdAndUpdate(id, input, {
        new: true,
      });

      return updatedproduct;
    },
    deleteProduct: async (_, { id }) => {
      let product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not founded.");
      }
      await Product.findByIdAndDelete(id);
      return "Product deleted";
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      const { userID } = ctx;
      // check if client exist
      const clientExist = await Client.findOne({ email });
      if (clientExist) {
        throw new Error("Client ready exist.");
      }
      // link to salesman
      let newClient = new Client(input);
      newClient.salesman = userID;
      console.log(ctx);
      // save to DB
      try {
        const Client = await newClient.save();
        return Client;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      const { userID } = ctx;
      const { email } = input;
      // check if exist
      const client = await Client.findOne({ _id: id });
      if (!client) {
        throw new Error("Client does not exist.");
      }
      // verify salesman
      if (userID !== client.salesman.toString()) {
        throw new Error("Not Authorized");
      }
      //verify email
      const emailUsed = await Client.findOne({ email });
      if (emailUsed && email !== client.email) {
        throw new Error(
          "Invalid email address, It is linked to another client."
        );
      }
      // update client
      try {
        const updatedClient = await Client.findByIdAndUpdate(id, input, {
          new: true,
        });
        return updatedClient;
      } catch (error) {
        console.log(error);
      }
    },
    deleteClient: async (_, { id }, ctx) => {
      const { userID } = ctx;
      const client = await Client.findById(id);
      if (!client) {
        throw new Error("Client does not exist");
      }
      if (userID !== client.salesman.toString()) {
        throw new Error("Not Authorized");
      }

      try {
        await Client.findByIdAndDelete(id);
        return "Client deleted";
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
