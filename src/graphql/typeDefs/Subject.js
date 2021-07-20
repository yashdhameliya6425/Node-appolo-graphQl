import { gql } from 'apollo-server-express'




export default gql`
    extend type Query {
        getAllSubject: [ Subject!]!
        getSingleSubject(id: ID!):Subject
    }

    extend type Mutation {
        createNewSubject(newPost:SubjectInput!):Subject!
        deleteSubject(id: ID!): Notice!
        updateSubject(updatedSubject: SubjectInput!,id: ID!):Subject!
       
    }

    type Subject {
        id: ID!
        Subjectname: String!
        SubjectCode:String!
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
        isActive:Boolean      
        
    }

    input SubjectInput {
        Subjectname: String!
        SubjectCode:String!
        
    }
    
     type Notice {
         id: ID!
         message: String
        success: Boolean
    }

    extend type Subscription {
        SubjectChange:SubjectSubscribe
    }

    type SubjectSubscribe {
        keyType:String
        data: Subject!
    }
   

`;