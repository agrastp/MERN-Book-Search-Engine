const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
      // By adding context to our query, we can retrieve the logged in user without specifically searching for them
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          return userData;
      }
      throw new AuthenticationError('Not logged in');
  }
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
      
            const correctPw = await user.isCorrectPassword(args.password);

      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
            return { token, user };
          },
          saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
        }
    }
  };

module.exports = resolvers;