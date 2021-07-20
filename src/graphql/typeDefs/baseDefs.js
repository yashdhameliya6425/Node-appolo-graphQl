import {gql} from 'apollo-server-express'

export default gql`
 scalar Date
 scalar JSON

type Query {
    _:Boolean!
}
type Mutation {
    _:Boolean!
}
type Subscription {
    _:Boolean
}
`;