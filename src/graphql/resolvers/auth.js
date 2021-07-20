import { AuthenticationError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
 me ? skip : new AuthenticationError('You are not authenticated as a user.');

 export const isAdmin = combineResolvers(
 isAuthenticated,
 (parent, args, { me: { role } }) => role.Rolename === 'admin' ? skip : new AuthenticationError('You are not authenticated as a admin.')
)
export const isfaculty = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) => role.Rolename === 'faculty' ? skip : new AuthenticationError('You are not authenticated as a faculty.')
   )
   export const isLibrarian = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) => role.Rolename === 'librarian' ? skip : new AuthenticationError('You are not authenticated as a librarian.')
   )