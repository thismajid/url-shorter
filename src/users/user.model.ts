/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from './role/role.enum';

export const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [Role.User, Role.Admin, Role.SuperAdmin],
      default: Role.User,
    },
  },
  { timestamps: true },
);

UserSchema.pre<User>('save', function (next: Function) {
  const user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

export interface User extends mongoose.Document {
  getUpdate();
  salt: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
}
