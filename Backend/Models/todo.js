import { MaxKey, MinKey } from 'bson';
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true
   },
   level: {
      type: Number,
      required: true,
      min: 1,
      max: 3
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   isComplete: {
      type: Boolean,
      default: false
   },
   isDelete: {
      type: Boolean,
      default: false,
   },
   completedTime: {
      type: Date,
      default: Date.now,
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true
   }
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;