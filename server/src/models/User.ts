import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../types/models';
import { env } from '../config/env';

const SALT_ROUNDS = 12;

interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Developer'] as UserRole[],
      default: 'Developer',
    },
    avatar: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// ─── Pre-save Hook: Hash Password ─────────────────────────────────────────────

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id.toString(), role: this.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions,
  );
};

// ─── Static Methods ───────────────────────────────────────────────────────────

UserSchema.statics.findByEmail = function (email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password');
};

// ─── toJSON Transform: Omit Password ─────────────────────────────────────────

UserSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    delete ret['password'];
    delete ret['passwordResetToken'];
    delete ret['passwordResetExpires'];
    return ret;
  },
});

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);
