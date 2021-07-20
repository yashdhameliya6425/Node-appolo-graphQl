import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const ObjectId = mongoose.Schema.Types.ObjectId;;


const UserSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    require: true
  },

  Lastname: {
    type: String,
    require: true
  },

  Email: {
    type: String,
    require: true
  },

  Password: {
    type: String,
    require: true
  },

  Class: {
    type: ObjectId,
    ref: 'Class'
  },

  Subject: {
    type: ObjectId,
    ref: 'Subject'
  },

  role: {
    type: ObjectId,
    ref: 'Role'
  },

  enrno: {
    type: String,
  },

  

  
  isActive: {
    type: Boolean,
    default: true,
  },

},

  {
    timestamps: true
  })

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    user.Password = await bcrypt.hash(user.Password, 10);
  }
  next();
})

const User = mongoose.model('user', UserSchema)
export default User