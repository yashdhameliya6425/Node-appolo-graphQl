import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;;

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    authorName:{
        type: String,
        require: true
    },
    publisher:{
        type:String,
        require:true
    }, 
    publishDate:{
        type:Date,
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

const Book = mongoose.model('Book', BookSchema)
export default Book   