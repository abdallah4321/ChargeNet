import mongoose from 'mongoose';

const NotificationsSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    message: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
  },
  { timestamps: true }
);

const Notifications = mongoose.model('Notifications', NotificationsSchema);
export default Notifications;
