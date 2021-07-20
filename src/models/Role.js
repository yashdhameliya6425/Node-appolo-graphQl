import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

 const ObjectId = mongoose.Schema.Types.ObjectId;;

const RoleSchema = new  mongoose.Schema({

    Rolename: {
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

const Role = mongoose.model('Role', RoleSchema)

export default Role
