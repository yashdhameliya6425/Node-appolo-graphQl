import { PubSub } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isAdmin } from './auth'
import { combineResolvers } from 'graphql-resolvers';
 const pubsub = new PubSub()

export default {
    Query: {
    
        getAllSubject:
        combineResolvers(isAdmin,
        async(_,__,{Subject})=>{
            let result = await Subject.find({})
            console.log("result12",result);
            return result
     },
        ),

     getSingleSubject:
     combineResolvers(isAdmin,
      async (_, { id }, { Subject }) => {
        let result = await Subject.findById(id)
        return result
    },
    ),
    },


    Mutation: {
        createNewSubject:
        combineResolvers(isAdmin,
         async (_, { newPost }, { Subject,me}) => {
            const resid = me && me.id
            newPost['createdBy'] = resid; 
            newPost['updatedBy'] = resid;

      let data = await Subject.findOne({"Subjectname":newPost.Subject})
      if(data){
          throw new UserInputError('Subjectname already exists ')
      
       }
            let result = await  Subject.create(newPost)
                
                    pubsub.publish(EVENTS.SUBJECT_CREATED, {
                        SubjectChange: { keyType:'SUBJECT_CREATED', data: result }
                    })
                   
                    return result
            
        },

        ),



        deleteSubject:
        combineResolvers(isAdmin,
         async (_, { id }, { Subject}) => {
           
            let deleted = await Subject.findByIdAndDelete(id)
    
            pubsub.publish(EVENTS.SUBJECT_DELETED, {
                SubjectChange: { keyType:'SUBJECT_DELETED', data: deleted }
            })
            return {
                success: true,
                id: id,
                message: 'Your Subject is deleted.!'&&'Subject deleted.!'

            }
        },

        ),


        updateSubject:
        combineResolvers(isAdmin,
         async (_, {updatedSubject,id }, {Subject,me }) => {
            const upid = me && me.id
            updatedSubject['updatedBy'] =  upid;
            let edit = await Subject.findByIdAndUpdate(id, {
                ...updatedSubject
            }, {
                new: true
            })
           
            pubsub.publish(EVENTS.SUBJECT_UPDATED, {
                SubjectChange: { keyType:'SUBJECT_UPDATED', data: edit }
            })
            
            return edit;
            
        },
        ),

    },

    Subscription: {
        SubjectChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.SUBJECT_CREATED, EVENTS.SUBJECT_DELETED, EVENTS.SUBJECT_UPDATED]),
        },
    },
  
}