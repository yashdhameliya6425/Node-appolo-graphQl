import { gql } from 'apollo-server-express'



export default gql`
    extend type Query {
        getAllBookIssuers: [ BookIssuersRes!]!
        getSingleBookIssuers(id: ID!):BookIssuersRes
    }

    extend type Mutation {
        createBookIssuer(Input:BookIssuerInput!):BookIssuers!
        deleteBookIssuer(id: ID!):messIssure!
        updateBookIssuer(updatedPost:BookInput!,id: ID!):BookIssuers!

        #penalty# not time to submit book#

        penaltyBookIssuer(Input:penaltyInput!):BookIssuers!
    }



#penalty Input#

  input penaltyInput {
        bookId: ID!
        studentId:ID!
      
    }



    # query Res #
    type BookIssuersRes {
        id: ID!
        bookId:Book 
        studentId:User
        returnDays:Int
        isReturn:Boolean
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
    }

    type BookIssuers {
        id: ID!
        bookId: ID!
        studentId:ID!
        returnDays:Int!
        penalty:Int
        isReturn:Boolean! 
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
    }

    input BookIssuerInput {
        bookId: ID!
        studentId:ID!
        penalty:Int
        returnDays:Int!
        isReturn:Boolean! 
    }
    
    type messIssure {
        id: ID!
        message: String
        success: Boolean
     }

    extend type Subscription {
        BookIssuerChange:BookIssuerSubscribe
    }

    type  BookIssuerSubscribe {
        keyType:String
        data:BookIssuers!
    }
 
`;