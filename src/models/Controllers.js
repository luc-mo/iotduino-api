import { model, Schema } from 'mongoose'

const Controllers = model('Controller', new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}))

export default Controllers