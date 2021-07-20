import { UserInputError, } from 'apollo-server-express';
import { hash, compare } from "bcryptjs"
import { PubSub } from 'apollo-server'
import { issueToken } from '../../rajister/index'
const { EVENTS } = require('../../subscription')
import { isAuthenticated, isAdmin, isfaculty } from './auth'
import { v4 as uuidv4 } from 'uuid';
import { combineResolvers } from 'graphql-resolvers';
import user from '../typeDefs/user';



const pubsub = new PubSub()



export default {

    Query: {
        getUserProfile:
            combineResolvers(isAuthenticated,
                async (_, args, { User, me }) => {
                    let profile = await User.findById(me._id).populate('role').populate('Class').populate('Subject')
                    console.log("profile", profile);
                    return profile
                }
            ),

        getAllStudent:
            combineResolvers(isAuthenticated,
                async (_, {Class}, { User }) => { 
                    let result = await User.find( { $or: [
                            { $and: [ {"Class":Class}, { enrno: { $exists: true } } ] },
                            { $and: [ {"Class":Class}, { Subject: { $exists: true } } ] }
                    ]}).populate('role').populate('Class')
                    console.log('result',result);
                    return result
                   
                }
            ),

        getSingleStudent:
            combineResolvers(isAuthenticated,
                async (_, { id }, { User }) => {
                    let result = await User.findById(id).populate('role')
                    return result
                }

            ),

        getSinglefaculty:
            combineResolvers(isAdmin,
                async (_, { id }, { User }) => {
                    let result = await User.findById(id).populate('role').populate('Class').populate('Subject')
                    console.log("result", result);
                    return result
                }
            ),



        getAllfaculty:
            combineResolvers(isAdmin,
                async (_, __, { User }) => {
                    let result = await User.find({ Subject: { $exists: true } }).populate('Subject').populate('role')
                    return result
                }

            )
    },

    Mutation: {

        registerUser: async (_, { newUser }, { User }) => {

            let { Email, Firstname } = newUser;
            let person;
            person = await User.findOne({  Firstname })
            if (person) {
                throw new UserInputError("Firstname is already taken")
            }
            person = await User.findOne({ Email })
            if (person) {
                throw new UserInputError("email is already taken")
            }

            person = new User(newUser);
            let result = await person.save();

            return {
                user: result

            }

        },

        loginUser: async (_, { Email, Password }, { User }) => {

            let user = await User.findOne({ Email })

            if (!user) {
                throw new UserInputError('user Email not found.')
            }

            let isMatch = await compare(Password, user.Password)

            if (!isMatch) {
                throw new UserInputError('Invalid password.')
            }
            if (!user.isActive) {
                throw new UserInputError('Unauthorized user.')
            }

            let token = await issueToken(user)


            return {
                token,
                user

            }
        },
        
        updateUser: async (_, { newUser, }, { User, me }) => {

            let editUser = await User.findByIdAndUpdate(me._id, {
                ...newUser
            }, {
                new: true
            })


            return editUser;


        },
       

        changeNewPassword:
            combineResolvers(isAuthenticated,
                async (_, { Input }, { User, me }) => {
                    let isMatch = await compare(Input.oldPassword, me.Password)

                    if (!isMatch) {
                        throw new UserInputError(' Password not match.')
                    }
                    if (Input.oldPassword === Input.newPassword) {
                        throw new UserInputError(' new Password can not match oldPassword.')
                    }
                    if (Input.newPassword !== Input.conFirmPassword) {

                        throw new UserInputError('newPassword can not  match conFirmPassword.')
                    }

                    const user = await User.findOne(me._id)
                    user.Password = Input.newPassword
                    await user.save()

                    console.log('user', user);
                    if (user) {
                        return {
                            user,
                            success: true,
                            message: 'Your PassWord is Change!.'
                        }

                    }

                }
            ),

        createNewfaculty:
            combineResolvers(isAdmin,
                async (_, { newfaculty }, { User, Role, me }) => {

                    let data = await Role.findOne({ Rolename: "faculty" })
                    console.log("data", data);

                    // newfaculty.role = data._id
                    let role = data._id
                    let result = await User.create({ ...newfaculty, role })
                    pubsub.publish(EVENTS.FACULTY_CREATED, {
                        UserChange: { keyType: 'FACULTY_CREATED', data: result }
                    })
                    console.log("result", result);
                    return result

                },
            ),


        deletefaculty:
            combineResolvers(isAdmin,
                async (_, { id }, { User }) => {

                    let deleted = await User.findByIdAndDelete(id)

                    pubsub.publish(EVENTS.FACULTY_DELETED, {
                        UserChange: { keyType: 'FACULTY_DELETED', data: deleted }
                    })
                    return {
                        success: true,
                        id: id,
                        message: 'Your Role is deleted!.'

                    }
                }
            ),

        updatefaculty:
            combineResolvers(isAuthenticated,
                async (_, { updatedPost, id }, { User, me }) => {
                    let facultyId = id
                    if (!id) {
                        facultyId = me._id
                    }
                    updatedPost['updatedBy'] = me._id
                    let editfaculty = await User.findByIdAndUpdate(facultyId, {
                        ...updatedPost
                    }, {
                        new: true
                    })

                    pubsub.publish(EVENTS.FACULTY_UPDATED, {
                        UserChange: { keyType: 'FACULTY_UPDATED', data: editfaculty }
                    })

                    return editfaculty;

                },
            ),
        createNewStudent:
            combineResolvers(isfaculty,
                async (_, { newStudent }, { User, Role, me }) => {
                    let Res = await Role.findOne({ Rolename: "student" })
                    console.log("res", Res);
                    newStudent['role'] = Res._id;
                    newStudent['enrno'] = uuidv4()
                    let result = await User.create(newStudent)
                    console.log("result", result);
                    pubsub.publish(EVENTS.STUDENT_CREATED, {
                        UserChange: { keyType: 'STUDENT_CREATED', data: result }
                    })

                    return result

                },
            ),


        deleteStudent:
            combineResolvers(isfaculty,
                async (_, { id }, { User }) => {

                    let deleted = await User.findByIdAndDelete(id)

                    pubsub.publish(EVENTS.STUDENT_DELETED, {
                        UserChange: { keyType: 'STUDENT_DELETED', data: deleted }
                    })
                    return {
                        success: true,
                        id: id,
                        message: 'Your Role is deleted!.'

                    }
                }
            ),

        updateStudent:
            combineResolvers(isfaculty,
                async (_, { updatedPost, id }, { User }) => {

                    let edit = await User.findByIdAndUpdate(id, {
                        ...updatedPost
                    }, {
                        new: true
                    })

                    pubsub.publish(EVENTS.STUDENT_UPDATED, {
                        UserChange: { keyType: 'STUDENT_UPDATED', data: edit }
                    })

                    return edit;

                },
            ),


    },




    Subscription: {
        UserChange: {
            subscribe: () => pubsub.asyncIterator([EVENTS.FACULTY_CREATED, EVENTS.FACULTY_DELETED, EVENTS.FACULTY_UPDATED, EVENTS.STUDENT_CREATED, EVENTS.STUDENT_DELETED, EVENTS.STUDENT_UPDATED]),
        },
    },

}