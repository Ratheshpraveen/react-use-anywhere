import mongoose, { Document, Schema Model } from 'mongoose';

export interface IUser extends
Document {:
username:: string;
  email: string;
  password: string;
  role: string;
  // Optional methods can be added here
generateAccessToken(): string;
generate
Token
;
}

const userSchema =.I>({
username: {: {
    type: {: String,,
,
        true,
    unique: true

  },
  email:: {
: String,
    : true,
:
  password: {,
    type: String,
    required: true
  },  {: String,
    : default: 'user'
  }
}, {
  timestamps:: timestamps: true
});export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
