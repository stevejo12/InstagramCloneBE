import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = Schema({
  user_id: { type: Schema.ObjectId, ref: 'users' },
  post_id: { type: Schema.ObjectId, ref: 'posts'},
  comment: String
}, {timestamps: true})

export default mongoose.model('comments', commentSchema)