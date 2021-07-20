import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;;

const ResultSchema = new mongoose.Schema({
    student: {
        type: ObjectId,
        ref: 'user'
    },
    Score: [{
            subject: {
                type:ObjectId,
                ref:'Subject'
            },
            marks: {
                type: Number,
                require: true
            },
            total: {
                type: Number,
                require: true
            }
        }],
    total:{
        type:Number,
    },
    grade:{
        type:String,
    },
    result:{
        type:String
    },
    percentage:{
        type:Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy : {
        type : ObjectId,
        ref : 'user'
    },
    updatedBy: {
        type : ObjectId,
        ref : 'user'
    },
    classId:{
       type : ObjectId,
       ref:'Class'
    },
}, {
    timestamps: true
})

const Result = mongoose.model('Result', ResultSchema)

export default Result