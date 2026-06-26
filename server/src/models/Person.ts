import mongoose, { Schema, Document } from 'mongoose';

export type Gender = 'male' | 'female' | 'other';

export interface IPerson extends Document {
  firstName: string;
  lastName: string;
  maidenName?: string;
  gender: Gender;
  birthDate?: Date;
  birthPlace?: string;
  deathDate?: Date;
  deathPlace?: string;
  isAlive: boolean;
  bio?: string;
  photo?: string; // Cloudinary URL
  photoPublicId?: string;
  // Relationships stored as references
  parents: mongoose.Types.ObjectId[];
  spouses: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
  // Which user in the system this person maps to (if they registered)
  linkedUser?: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PersonSchema = new Schema<IPerson>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    maidenName: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    birthDate: Date,
    birthPlace: { type: String, trim: true },
    deathDate: Date,
    deathPlace: { type: String, trim: true },
    isAlive: { type: Boolean, default: true },
    bio: { type: String, maxlength: 2000 },
    photo: String,
    photoPublicId: String,
    parents: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    spouses: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    children: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
    linkedUser: { type: Schema.Types.ObjectId, ref: 'User' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

PersonSchema.index({ firstName: 'text', lastName: 'text', maidenName: 'text' });

export default mongoose.model<IPerson>('Person', PersonSchema);
