import { gql } from 'apollo-server-express'

export default gql`
    extend type Query {
        getAllClass: [ Class!]!
        getSingleClass(id: ID!):Class
    }

    extend type Mutation {
        createNewClass(newPost: ClassInput!): Class!
        deleteClass(id: ID!): Notification!
        updateClass(updatedPost:ClassInput!,id: ID!):Class!
       
    }

    type Class {
        id: ID!
        Classname: String!
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
        isActive:Boolean

        
    }

    input ClassInput {
        Classname: String!
        
    }
    
    type Notification {
        id: ID!
        message: String
        success: Boolean
    }

    extend type Subscription {
        ClassChange:ClassSubscribe
    }

    type ClassSubscribe {
        keyType:String
        data:Class!
    }
   

`;