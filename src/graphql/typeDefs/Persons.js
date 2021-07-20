import { gql } from 'apollo-server-express'

export default gql`
      extend type Query {
        
      }

    extend type Mutation {
      

       
    }

    type location {
        country:String
        address:String
    }

    type company {
        title:String
        email:String
        phone:String
        location:location

    }

    type Person {
        id: ID!
        name: String
        isActive:Boolean
        registered: Date
        age:Int
        gender:String
        eyeColor:String
        favoriteFruit:String
        company:company
        tags:[JSON] 
     

`;