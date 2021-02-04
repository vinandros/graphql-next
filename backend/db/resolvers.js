const User = require("../models/User");
const bcryptjs = require("bcryptjs");
// Resolvers
const resolvers = {
  Query: {
    getCourse: () => {
      return "Uno";
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
  },
};

module.exports = resolvers;
