import { Schema, model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { TTSEnum } from './tts';

export interface IUser {
   name: string;
   email: string;
   username: string;
   password: string;
   created_at?: Date;
   generateToken: Function;
   defaultTTSEngine: string;
}

const UserSchema = new Schema<IUser>({
   name: {
      type: String,
      required: true,
   },
   username: {
      type: String,
      required: true,
      unique: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   defaultTTSEngine: {
      type: String,
      enum: TTSEnum,
      default: TTSEnum.Google,
   },
});

UserSchema.methods.generateToken = function () {
   const data = {
      _id: this._id,
      name: this.name,
      username: this.username,
      email: this.email,
   };
   return jwt.sign(data, process.env.JWT_SECRET);
};

UserSchema.pre('save', function (next) {
   const user = this;
   bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next();

      user.password = hash;
      next();
   });
});

export const User = model<IUser>('User', UserSchema);
