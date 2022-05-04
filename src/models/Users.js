import { model, Schema } from 'mongoose';

const Users = model('User', new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  salt: String,
  firstName: String,
  lastName: String,
  email: String,
  role: { type: String, enum: ['user', 'developer'], default: 'user' },
  apiToken: [{ type: String }],
  controllers: [{ type: Schema.Types.ObjectId, ref: 'Controller' }],
}));

export default Users;