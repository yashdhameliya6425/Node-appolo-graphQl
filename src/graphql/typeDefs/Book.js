import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getAllBook: [ Book!]!
        getSingleBook(id: ID!):Book
    }

    extend type Mutation {
        createBook(Input:BookInput!): Book!
        deleteBook(id: ID!): mess!
        updateBook(updatedPost:BookInput!,id: ID!): Book!
       
    }

    type Book {
        id: ID!
        title: String!
        authorName:String!
        publisher:String!
        publishDate:Date
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
    }
  

    input BookInput {
        title: String!
        authorName:String!
        publisher:String!
        publishDate:Date 
    }
    
    type mess {
        id: ID!
        message: String
        success: Boolean
    }

    extend type Subscription {
        BookChange: BookSubscribe
    }

    type  BookSubscribe {
        keyType:String
        data: Book!
    }
 
`;