import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    UserImg: { type: String },
    phone: { type: String },
    ban: { type: String },
    role: {
      type: String,
      enum: ['Driver', 'Owner', 'SuperAdmin'],
      default: 'Driver',
    },
  },
  { timestamps: true }
);

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Users = mongoose.model('Users', usersSchema);

export default Users;
