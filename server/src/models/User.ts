import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type Role = 'admin' | 'editor' | 'viewer';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  inviteToken?: string;
  inviteTokenExpiry?: Date;
  isVerified: boolean;
  linkedPerson?: mongoose.Types.ObjectId;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    inviteToken: String,
    inviteTokenExpiry: Date,
    isVerified: { type: Boolean, default: false },
    linkedPerson: { type: Schema.Types.ObjectId, ref: 'Person' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
