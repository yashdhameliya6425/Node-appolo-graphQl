import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isAdmin,isfaculty  } from './auth'
import { combineResolvers } from 'graphql-resolvers';
const pubsub = new PubSub()

export default {
    Query: {

        getAllClass:
            combineResolvers(isfaculty,
                async (_, __, { Class, me }) => {
                    console.log("me", me);
                    let result = await Class.find({})
                    console.log("result12", result);
                    return result
                }
            )
        ,

        getSingleClass:
        combineResolvers(isAdmin,
         async (_, { id }, { Class }) => {
            let result = await Class.findById(id)
            return result
        },
        ),
    },


    Mutation: {
        createNewClass:
        combineResolvers(isAdmin,
         async (_, { newPost }, { Class, me }) => {
            const dataid = me && me.id
            newPost['createdBy'] = dataid;
            newPost['updatedBy'] = dataid;

            // let data =await Class.findOne({"Classname":req.body.Classname})
            let data = await Class.findOne({"Classname":newPost.Classname})
               if(data){
                throw new UserInputError('ClassName already exists ') 
               }
            let result = await Class.create(newPost)
            console.log("result", result)
            pubsub.publish(EVENTS.CLASS_CREATED, {
                ClassChange: { keyType: 'CLASS_CREATED', data: result }
            })


            return result
        },

        ),

        deleteClass: 
         combineResolvers(isAdmin,
             async (_, { id }, { Class }) => {

            let deleted = await Class.findByIdAndDelete(id)

            pubsub.publish(EVENTS.CLASS_DELETED, {
                ClassChange: { keyType: 'CLASS_DELETED', data: deleted }
            })
            return {
                success: true,
                id: id,
                message: 'Your Role is deleted!.'

            }
        },
),


        updateClass:
        combineResolvers(isAdmin,
         async (_, { updatedPost, id }, { Class ,me}) => {
            const item = me && me.id
            updatedPost['updatedBy'] = item;
            let editpet = await Class.findByIdAndUpdate(id, {
                ...updatedPost
            }, {
                new: true,
                 
            })

            pubsub.publish(EVENTS.CLASS_UPDATED, {
                ClassChange: {keyType: 'CLASS_UPDATED', data: editpet}
            })

            return editpet;

        },

        ),
    },


    Subscription: {
        ClassChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.CLASS_CREATED,EVENTS.CLASS_DELETED,EVENTS.CLASS_UPDATED]),
        },
    },

}