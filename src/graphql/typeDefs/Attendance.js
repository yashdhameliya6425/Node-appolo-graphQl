import { gql } from 'apollo-server-express'


export default gql`
    extend type Query {
        getAllAttendance:[ AttendanceRes!]!
        getSingleAttendance(id: ID!):AttendanceRes
    }

    extend type Mutation {
        createNewAttendance: Attendance!
        setStudent(newPost:setStudentInput!):Attendance!
        updateNewAttendance(updateAttendance:AttendanceInput!,id: ID!):Attendance!
       
    }

    input StudentRes{
        student: ID
        status:String
    }
    
    type StudentInsertOrUpdate{
        student: ID
        status:String
    }

    type StudentRefRes {
        student: Student
        status:String
    }



    type Attendance {
        id: ID!
        Students: [StudentInsertOrUpdate]
        faculty: ID
        createdAt:Date
        updatedAt:Date
    }

    input setStudentInput {
        id: ID
        Students:[StudentRes]
    }


    type AttendanceRes {
        id: ID!
        Students:[StudentRefRes]
        faculty: User          
        createdAt:Date
        updatedAt:Date
    }


    input AttendanceInput {
        Students:StudentRes
    }
    
    
    extend type Subscription {
        AttendanceChange:AttendanceSubscribe
    }

    type AttendanceSubscribe {
        keyType:String
        data:Attendance!
    }
   

`;