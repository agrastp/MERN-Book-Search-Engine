const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
 }

type Book {
    bookId: String!
    title: String!
    description: String!
    authors: [String]!
    image: String
    link: String
 }

type Auth {
    token: ID!
    user: User
  }

type Query {
    users: [User]!
    user(userID: ID!): User
    me: User
  }

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(userId: ID!, savedBooks: String!): User
    removeBook(savedBooks: String!): User
  }
`;

module.exports = typeDefs;