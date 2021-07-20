import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;;

const AttendanceSchema = new mongoose.Schema({

    Students: [
        {
            student: {
                type: ObjectId,
                ref: 'user'
            },
            status: {
                type: String,
                default: 'present'
            }
        }
    ],

    faculty: {
        type: ObjectId,
        ref: 'user'
    },



}, {
    timestamps: true
})

const Attendance = mongoose.model('Attendance', AttendanceSchema)

export default Attendance