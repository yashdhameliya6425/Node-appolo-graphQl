import {gql} from 'apollo-server-express'


export default gql`

extend type Query {

     getUserProfile:UserRes
     getSingleStudent(id: ID!):Student
     getSinglefaculty(id:ID!):User
     getAllStudent( Class:ID!):[Student]
     getAllfaculty:[User!]!
     

    }

extend type Mutation {
    
     registerUser(newUser: UserInput!): AuthResp!
     loginUser(Email: String!, Password: String!): signInResp!
     updateUser(newUser: UserInput): User!

    #  faculty

     createNewfaculty(newfaculty: UserInput!): User!
     deletefaculty(id: ID!): message!
     updatefaculty(updatedPost:UserInput!,id: ID):User!
     # student

     createNewStudent(newStudent: StudentInput!): Student!
     deleteStudent(id: ID!): message
     updateStudent(updatedPost:StudentInput!,id: ID):Student!

     # change password
     changeNewPassword(Input:ChandPassInput):messagePass!
    
    }

  input ChandPassInput{
    oldPassword:String
    newPassword:String
    conFirmPassword:String
   } 

   type messagePass {
        message: String
        success: Boolean
    }

    input UserInput {
        Firstname: String! 
        Lastname: String!
        Email:String!
        Password:String
        Class:ID
        Subject:ID
        role:ID
    } 

    type UserRes {
        id:ID!
        Firstname: String! 
        Lastname: String!
        Email:String!
        Password:String!
        Class:ID
        Subject:ID
        role:Role
        createdAt:Date
        updatedAt:Date
        isActive:Boolean
        enrno:Int
    }

    type User {
        id:ID!
        Firstname: String! 
        Lastname: String!
        Email:String!
        Password:String!
        Class:Class
        Subject:Subject
        role:Role
        createdAt:Date
        updatedAt:Date
        isActive:Boolean
    }
    
    input StudentInput {
        Firstname: String! 
        Lastname: String!
        Email:String!
        Password:String
        Class:ID
    }

    type Student {
        id:ID!
        Firstname: String! 
        Lastname: String!
        Email:String!
        Password:String!
        Class:Class
        enrno:String
        role:Role
        createdAt:Date
        updatedAt:Date
        isActive:Boolean

    }

    type AuthResp {
        user: User!, 
    }
    type signInResp {
        user: User!,
        token: String!
    }

    type message {
        id: ID!
        message: String
        success: Boolean
    }

    extend type Subscription {
        UserChange:UserSubscribe
    }
    
    type UserSubscribe {
        keyType:String
        data: User!
    }

` 