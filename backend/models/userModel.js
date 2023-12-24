import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

var userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, index: true },
    lastname: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    cart: { type: Array, default: [] },
    address: [
      {
        type: String,
      },
    ],
    whishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: { type: String },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// encrypt passweord
userSchema.pre('save', async function (next) {
  // if password is not modified dont re-encrypt
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// below function is for token reset fro email
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // in 10minutes valid for 10mins
  return resetToken;
};

const User = mongoose.model('User', userSchema);
export default User;
