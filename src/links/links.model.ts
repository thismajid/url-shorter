/* eslint-disable prettier/prettier */
import { Document, Schema } from 'mongoose';

export const LinkSchema = new Schema(
  {
    link: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    user: { type: String },
  },
  { timestamps: true },
);

export interface Link extends Document {
  id: string;
  link: string;
  name: string;
  user?: string;
}
