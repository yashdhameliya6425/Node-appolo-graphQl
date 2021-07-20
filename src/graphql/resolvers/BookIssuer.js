import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isLibrarian } from './auth'
import moment from 'moment'
import { combineResolvers } from 'graphql-resolvers';
const pubsub = new PubSub()

export default {
    Query: {

        getAllBookIssuers:
            combineResolvers(isLibrarian,
                async (_, __, { BookIssuer, me }) => {
                    let result = await BookIssuer.find({}).populate('bookId').populate('studentId')
                    console.log("result12", result);
                    return result
                }
            )
        ,

        getSingleBookIssuers:
            combineResolvers(isLibrarian,
                async (_, { id }, { BookIssuer, me }) => {
                    let result = await BookIssuer.findById(id).populate('bookId').populate('studentId')
                    return result
                },
            ),
    },



    Mutation: {
        createBookIssuer:
            combineResolvers(isLibrarian,
                async (_, { Input }, { BookIssuer, me }) => {
                    const id = me && me.id
                    Input['createdBy'] = id;
                    Input['updatedBy'] = id;
                    let result = await BookIssuer.create(Input)
                    console.log("result", result)
                    pubsub.publish(EVENTS.BOOKISSUER_CREATED, {
                        BookIssuerChange: { keyType: 'BOOKISSUER_CREATED', data: result }
                    })

                    return result
                },
            ),

        deleteBookIssuer:
            combineResolvers(isLibrarian,
                async (_, { id }, { BookIssuer }) => {
                    let res = await BookIssuer.findById(id)
                    const result = await BookIssuer.findByIdAndUpdate(res._id, { isDeleted: true }, { new: true })
                    pubsub.publish(EVENTS.BOOKISSUER_DELETED, {
                        BookIssuerChange: { keyType: 'BOOKISSUER_DELETED', data: result }
                    })

                    return {
                        success: true,
                        id: id,
                        message: 'Your BookIssuer is deleted!.'

                    }
                },
            ),


        updateBookIssuer:
            combineResolvers(isLibrarian,
                async (_, { updatedPost, id }, { BookIssuer, me }) => {
                    const id1 = me && me.id
                    updatedPost['updatedBy'] = id1;
                    console.log('id1', updatedPost);
                    let res = await BookIssuer.findByIdAndUpdate(id, {
                        ...updatedPost
                    }, {
                        new: true,

                    })

                    pubsub.publish(EVENTS.BOOKISSUER_UPDATED, {
                        BookIssuerChange: { keyType: 'BOOKISSUER_UPDATED', data: res }
                    })

                    return res;

                },
            ),
            

        penaltyBookIssuer:
            combineResolvers(isLibrarian,
                async (_, { Input }, { BookIssuer, me }) => {
                    // cerate penalty //
                    let penalty = 0
                    // find id and reacord get
                    const data = await BookIssuer.findOne({ "bookId": Input.bookId, "studentId": Input.studentId })
                    //get return date
                    const returnDate = moment(data.createAt).add(data.returnDays, 'days').format()
                    //compare in today date in return date
                    const Date = moment().isAfter(returnDate, 'year')
                    //genrate penalty in base  condition
                    if (data.isReturn == false && !Date) {
                        const NoOfDays = moment().diff(moment(returnDate), 'days')

                        if (NoOfDays >= 1) {
                            penalty = penalty * NoOfDays
                        }
                    }
                    //update penalty 
                    let res = await BookIssuer.findByIdAndUpdate(data._id, {
                        penalty
                    }, {
                        new: true,
                    })

                    return res

                }
            )
    },

    Subscription: {
        BookIssuerChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.BOOKISSUER_CREATED, EVENTS.BOOKISSUER_DELETED, EVENTS.BOOKISSUER_UPDATED]),
        },
    },

}