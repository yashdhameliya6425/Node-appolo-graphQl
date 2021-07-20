import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isAdmin } from './auth'
import { combineResolvers } from 'graphql-resolvers';
 const pubsub = new PubSub()

export default {
    Query: {
        getAll:
        combineResolvers(isAdmin,
        async(_,__,{Role})=>{
            let result = await Role.find({})
          ;
            return result
     },
   ),

     getSingle:
     combineResolvers(isAdmin,
     
     async (_, { id }, { Role }) => {
        let result = await Role.findById(id)

        return result
    },

     ),

    },


    Mutation: {
        createNewRole:
        combineResolvers(isAdmin,
             async (_, { newPost }, { Role,me}) => {
                 console.log("newPost",newPost);
           const id = me && me.id
                newPost['createdBy'] = id; 
                newPost['updatedBy'] = id;
               let data = await Role.findOne({"Rolename":newPost.Rolename})
               if(data){
                throw new UserInputError('Name already exists ') 
               }
                   let result = await  Role.create(newPost)
                
                    pubsub.publish(EVENTS.ROLE_CREATED, {
                        RoleChange: { keyType:'ROLE_CREATED', data: result }
                    })
                   
                    return result
            
        },
        ),

        deleteRole:
        combineResolvers(isAdmin,
         async (_, { id }, { Role }) => {
           
            let deleted = await Role.findByIdAndDelete(id)
           
            pubsub.publish(EVENTS.ROLE_DELETED, {
                RoleChange: { keyType:'ROLE_DELETED', data: deleted }
            })
            return {
                success: true,
                id: id,
                message: 'Your Role is deleted!.'

            }
        },
        ),

        updateRole:
        combineResolvers(isAdmin,
         async (_, { updatedPost,id }, {Role,me }) => {
            const userid = me && me.id
            updatedPost['updatedBy'] = userid;
            let editpet = await Role.findByIdAndUpdate(id, {
                ...updatedPost
            }, {
                new: true
            })
           
            pubsub.publish(EVENTS.ROLE_UPDATED, {
                PetChange: { keyType:'ROLE_UPDATED', data: editpet }
            })
    
            return editpet;
            
        },
        ),
 
    },
        

   


    Subscription: {
        RoleChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.ROLE_CREATED, EVENTS.ROLE_DELETED, EVENTS.ROLE_UPDATED]),
        },
    },
  
}