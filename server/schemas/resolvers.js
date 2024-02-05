const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
      // By adding context to our query, we can retrieve the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).select('-__v -password');;
        }
        throw AuthenticationError;
      },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
          const user = await User.create({ username, email, password });
          // {id, username, email, password}
          const token = signToken(user);
    
          return { token, user };
        },
        login: async (parent, args) => {
            const user = await User.findOne({ email: args.email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await profile.isCorrectPassword(args.password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (parent, args, context) => {
            // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: user._id },
                {
                  $addToSet: { savedBooks: args },
                },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
            // If user attempts to execute this mutation and isn't logged in, throw an error
            throw AuthenticationError;
          },
          removeBook: async (parent, {bookId }) => {
            return User.findOneAndUpdate(
              { _id: user._id },
              { $pull: { savedBooks: {bookId} } },
              { new: true }
            );
          },
        },
      };

module.exports = resolvers;