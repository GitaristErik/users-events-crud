const mongoose = require('mongoose');

const simpleUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phoneNumber: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Create compound index for email uniqueness per owner
simpleUserSchema.index({ email: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('SimpleUser', simpleUserSchema);
