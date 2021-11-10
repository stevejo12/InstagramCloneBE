import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = Schema({
  user_id: { type: Schema.ObjectId, ref: 'users' },
  caption: String,
  uri: String
}, {timestamps: true})

export default mongoose.model('posts', postSchema)