import { gql } from 'apollo-server-express'




export default gql`
    extend type Query {
        getAll: [ Role!]!
        getSingle(id: ID!): Role
    }

    extend type Mutation {
        createNewRole(newPost: RoleInput!): Role!
        deleteRole(id: ID!): PostNotification!
        updateRole(updatedPost:RoleInput!,id: ID!): Role!
       
    }

    type Role {
        id: ID!
        Rolename: String!
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
        isActive:Boolean
   
    }

    input RoleInput {
        Rolename: String!
        
    }
    
    type PostNotification {
        id: ID!
        message: String
        success: Boolean
    }

    extend type Subscription {
        RoleChange:RoleSubscribe
    }

    type RoleSubscribe {
        keyType:String
        data: Role!
    }
   

`;