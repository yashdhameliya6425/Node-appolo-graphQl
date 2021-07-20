import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;;

const personSchema = new mongoose.Schema({
  name: {
    type: String
  },
  isActive: {
    type: Boolean
  },
  registered: {
    type: Date,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,

  },
  eyeColor: {
    type: String,

  },
  favoriteFruit: {
    type: String
  },
  company: {
    title: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    location: {
      country: {
        type: String
      },
      address: {
        type: String
      },
    },
  },
  tags: {
    type: Array
  }
}, {
  timestamps: true
})

const persons = mongoose.model('person', personSchema)
export default persons