import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    me {
      _id
    email
    password
    username
    bookCount
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
`;

