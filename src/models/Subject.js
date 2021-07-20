import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

 const ObjectId = mongoose.Schema.Types.ObjectId;;

const SubjectSchema = new mongoose.Schema({

    Subjectname: {
        type: String,
        require: true
    },

    SubjectCode: {
        type: String,
        require: true
    },
  
    isActive: {
        type: Boolean,
        default: true,
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

const Subject = mongoose.model('Subject',SubjectSchema)

export default Subject