/* eslint-disable prettier/prettier */
import { Document, Schema } from 'mongoose';

export const ResetSchema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export interface Reset extends Document {
  id: string;
  email: string;
  token: string;
  isUsed?: boolean;
}
