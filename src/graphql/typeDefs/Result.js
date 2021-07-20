import { gql } from 'apollo-server-express'

export default gql`
extend type Query {
  
    getSingleResult(student:ID,classId:ID):Result!
    getAllStudentResultByPersentage:[ Result2!]!
}

    extend type Mutation {
        createResult(Input:ResultInput!): Result!
        updateResult(newPost:ResultInputRes!):Result!
       
    }


input ScoreRes {
    subject:ID!
    marks:Int!
    total:Int!

}

type ResScore {
    subject:ID!
    marks:Int!
    total:Int!

}
type ResScore2 {
    subject:Subject
    marks:Int!
    total:Int!

}


    type Result {
         id: ID!
         student:ID
         Score:[ResScore]
         total:Int
         grade:String
         result:String
         percentage:Float
         classId:ID
         createdBy: ID
         updatedBy: ID
         createdAt:Date
         updatedAt:Date
    }


    type Result2 {
        id: ID!
        student:ID
        Score:[ResScore2]
        total:Int
        grade:String
        result:String
        percentage:Float
        classId:Class
        createdBy: ID
        updatedBy: ID
        createdAt:Date
        updatedAt:Date
   }

    input ResultInput {
        student:ID
    }

    input ResultInputRes{
        student:ID
        classId:ID
        Score:[ScoreRes]
    }
    
    
    extend type Subscription {
        ResultChange: ResultSubscribe
    }

    type  ResultSubscribe {
        keyType:String
        data:Result!
    }
 
`;