import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isfaculty } from './auth'
import { combineResolvers } from 'graphql-resolvers';
const pubsub = new PubSub()

export default {
    Query: {

        getAllAttendance:
            combineResolvers(isfaculty,
                async (_, __, { Attendance, me }) => {
                    console.log("me", me);
                    let result = await Attendance.find({}).populate('Students.student').populate({ path: 'faculty', populate: { path: 'Class' } })
                    console.log("result12", result);
                    return result
                }
            ),


        getSingleAttendance:
            combineResolvers(isfaculty,
                async (_, { id }, { Attendance, me }) => {
                    let result = await Attendance.findById(id)
                    return result
                },
            ),
    },


    Mutation: {
        createNewAttendance:
            combineResolvers(isfaculty,
                async (_, args, { Attendance, me }) => {
                    const id1 = me && me.id
                    let newPost = {
                        faculty: id1
                    }
                    let result = await Attendance.create(newPost)
                    console.log("result", result)
                    pubsub.publish(EVENTS.ATTENDANCE_CREATED, {
                        AttendanceChange: { keyType: 'ATTENDANCE_CREATED', data: result }
                    })

                    return result
                },
            ),



        setStudent:
            combineResolvers(isfaculty,
                async (_, { newPost }, { Attendance }) => {
                    const attandanceId = newPost.id
                    delete newPost.id
                    console.log('newPost', newPost.Students);
                    let data = await Attendance.findByIdAndUpdate(attandanceId, { $addToSet: { Students:newPost.Students } }
                        , {
                            new: true
                        })

                    return data;

                },

            ),




        updateNewAttendance:
            combineResolvers(isfaculty,
                async (_, { updateAttendance, id }, { Attendance }) => {
                   
                    const Res = await Attendance.findOneAndUpdate({
                        "_id": id,

                        "Students.student": updateAttendance.Students.student
                    },

                        {

                            "Students.$.status": updateAttendance.Students.status
                        }

                        , {
                            new: true
                        })


                    console.log('updateAttendance.Students.status', updateAttendance.Students.status);
                    pubsub.publish(EVENTS.ATTENDANCE_UPDATED, {
                        AttendanceChange: { keyType: 'ATTENDANCE_UPDATED', data: Res }
                    })

                    return Res;

                },

            ),

    },

    Subscription: {
        AttendanceChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.ATTENDANCE_CREATED, EVENTS.ATTENDANCE_UPDATED]),
        },
    },

}