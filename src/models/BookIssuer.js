import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;;

const BookIssuerSchema = new mongoose.Schema({
   bookId:{
        type:ObjectId,
        ref:'Book'
    },
    studentId:{
        type:ObjectId,
        ref:'user'
    },
    returnDays:{
        type:Number,
        require:true
    }, 
    penalty:{
        type:Number,
        default:0
    },
    isReturn: {
        type: Boolean,
        default:false,
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
    }
}, {
    timestamps: true
})

const BookIssuer = mongoose.model('BookIssuer',BookIssuerSchema)
export default BookIssuer   