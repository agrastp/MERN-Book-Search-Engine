const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
      profiles: async () => {
        return User.find();
      },
  
      profile: async (parent, { userId }) => {
        return User.findOne({ _id: userId });
      },
      // By adding context to our query, we can retrieve the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw AuthenticationError;
      },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
          const profile = await User.create({ username, email, password });
          const token = signToken(profile);
    
          return { token, profile };
        },
        login: async (parent, { email, password }) => {
            const profile = await User.findOne({ email });
      
            if (!profile) {
              throw AuthenticationError;
            }
      
            const correctPw = await profile.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(profile);
            return { token, profile };
          },
          saveBook: async (parent, { user, body }, context) => {
            // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
            if (context.user) {
              return User.findOneAndUpdate(
                { _id: user._id },
                {
                  $addToSet: { savedBooks: body },
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
          removeBook: async (parent, { user, params }) => {
            return User.findOneAndUpdate(
              { _id: user._id },
              { $pull: { savedBooks: params.bookId } },
              { new: true }
            );
          },
        },
      };

module.exports = resolvers;