const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rejectedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Hash the password before saving the user model
UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);