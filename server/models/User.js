import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    fullName: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    lastSignInAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
