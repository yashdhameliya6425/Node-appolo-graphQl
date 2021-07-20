import { PubSub, UserInputError } from 'apollo-server'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isfaculty } from './auth'
import { combineResolvers } from 'graphql-resolvers';
import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
const pubsub = new PubSub()

export default {
    
    Query: {
        getSingleResult:
        combineResolvers(isfaculty,
        async(_,{student,classId},{Result})=>{
            let data = await Result.findOne({'student':student, 'classId':classId})

            var val = data?.Score?.reduce(function (previousValue, currentValue) {
                console.log('previousValue', previousValue);
                return {
                    marks: previousValue.marks + currentValue.marks,
                    total: previousValue.total + currentValue.total,

                }
            });
            //   4 get  Percentage in student
            const Percentage = val.marks / val.total * 100
            data.total = val.marks,
            data.percentage = Percentage

            //  5 student pass and fail in mark 
            const Res = data?.Score?.filter(score => score.marks < 20)
            data.result = Res.length > 0 ? 'fail' : 'pass'
            //  6 student grade in Percentage base
            if (data.result === 'pass' && Percentage >= 70) {
                data.grade = 'distinction'

            } else if (data.result === 'pass' && Percentage >= 60 && Percentage < 70) {
                data.grade = 'first class'

            } else if (data.result === 'pass' && Percentage >= 50 && Percentage < 60) {
                data.grade = 'second class'

            } else if (data.result === 'pass' && Percentage > 35) {
                data.grade = 'pass'

            } else {
                data.grade = 'fail'
            }

            return data
     },
   ),

   getAllStudentResultByPersentage:
   combineResolvers(isfaculty,
    async(_,__,{Result})=>{
        let data = await Result.find({}).populate('classId').populate('Score.subject').sort({percentage:-1})
        return data
 },
   
   )
    },
    Mutation: {
        createResult:
            combineResolvers(isfaculty,
                async (_, { Input }, { Result, User, me }) => {
                    const id = me && me.id
                    Input['createdBy'] = id;
                    Input['updatedBy'] = id;
                    const findClassId = await User.findOne({ "_id": Input.student })
                    console.log('findClassId', findClassId);
                    Input['classId'] = findClassId.Class
                    let data = await Result.create(Input)
                    console.log("result", data)
                    pubsub.publish(EVENTS.RESULT_CREATED, {
                        ResultChange: { keyType: 'RESULT_CREATED', data: data }
                    })

                    return data
                },
            ),


        updateResult:
            combineResolvers(isfaculty,
                async (_, { newPost }, { Result }) => {

                    // * create Result in student * //
                    //  1 find id and  get record 
                    const find = await Result.findOne({ 'student': newPost.student, 'classId': newPost.classId, })

                    //   2 value push in array  
                    let data = await Result.findOneAndUpdate({_id:find._id}, { $addToSet: { Score: newPost.Score } }
                        , {
                            new: true
                        })
                       //3 total in array in object  field
                    var val = data?.Score?.reduce(function (previousValue, currentValue) {
                        console.log('previousValue', previousValue);
                        return {
                            marks: previousValue.marks + currentValue.marks,
                            total: previousValue.total + currentValue.total,

                        }
                    });
                    //   4 get  Percentage in student
                    const Percentage = val.marks / val.total * 100
                    data.total = val.marks,
                    data.percentage = Percentage

                    //  5 student pass and fail in mark 
                    const Res = data?.Score?.filter(score => score.marks < 20)
                    data.result = Res.length > 0 ? 'fail' : 'pass'
                    //  6 student grade in Percentage base
                    if (data.result === 'pass' && Percentage >= 70) {
                        data.grade = 'distinction'

                    } else if (data.result === 'pass' && Percentage >= 60 && Percentage < 70) {
                        data.grade = 'first class'

                    } else if (data.result === 'pass' && Percentage >= 50 && Percentage < 60) {
                        data.grade = 'second class'

                    } else if (data.result === 'pass' && Percentage > 35) {
                        data.grade = 'pass'

                    } else {
                        data.grade = 'fail'
                    }

                    await data.save()
                    return data
                }
            ),
    },

    Subscription: {
        ResultChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.RESULT_CREATED]),
        },
    },

}