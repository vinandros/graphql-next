require("dotenv").config();
const User = require("../models/User");
const Product = require("../models/Product");
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
  },
};

module.exports = resolvers;
