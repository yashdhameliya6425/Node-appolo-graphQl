import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isLibrarian } from './auth'
import { combineResolvers } from 'graphql-resolvers';
const pubsub = new PubSub()

export default {
    Query: {

        getAllBook:
            combineResolvers(isLibrarian,
                async (_, __, { Book, me }) => {
                    console.log("me", me);
                    let result = await Book.find({})
                    console.log("result12", result);
                    return result
                }
            )
        ,

        getSingleBook:
        combineResolvers(isLibrarian,
         async (_, { id }, { Book,me }) => {
            let result = await Book.findById(id)
            return result
        },
        ),
    },



    Mutation: {
        createBook:
        combineResolvers(isLibrarian,
         async (_, { Input }, { Book, me }) => {
            const id = me && me.id
            Input['createdBy'] = id;
            Input['updatedBy'] = id;
            let data = await  Book.findOne({"title":Input.title})
               if(data) {
                throw new UserInputError('book already exists ')  

               }
            let result = await  Book.create(Input)
            console.log("result", result)
            pubsub.publish(EVENTS.BOOK_CREATED, {
                BookChange: { keyType:'BOOK_CREATED', data: result }
            })

            return result
        },

        ),

        deleteBook: 
         combineResolvers(isLibrarian,
          async (_, { id }, {Book }) => {

            let res = await Book.findByIdAndDelete(id)

            pubsub.publish(EVENTS.BOOK_DELETED, {
                BookChange: {keyType: 'BOOK_DELETED', data:res}
            })

            return {
                success: true,
                id: id,
                message: 'Your Book is deleted!.'

            }
        },
),


        updateBook:
        combineResolvers(isLibrarian,
         async (_, { updatedPost,id}, { Book ,me}) => {
            const id1 = me && me.id
            updatedPost['updatedBy'] = id1;
            console.log('id1', updatedPost);
            let res= await Book.findByIdAndUpdate(id, {
                ...updatedPost
            }, {
                new: true,
                 
            })

            pubsub.publish(EVENTS.BOOK_UPDATED, {
                BookChange: {keyType: 'BOOK_UPDATED', data: res}
            })

            return res;

        },
        ),

    },





    Subscription: {
        BookChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.BOOK_CREATED,EVENTS.BOOK_DELETED,EVENTS.BOOK_UPDATED]),
        },
    },

}  