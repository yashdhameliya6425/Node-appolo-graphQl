import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

  const ObjectId = mongoose.Schema.Types.ObjectId;;

const ClassSchema = new  mongoose.Schema({

    Classname: {
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

const Class = mongoose.model('Class', ClassSchema)

export default Class   