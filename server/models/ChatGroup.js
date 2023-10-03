const mongoose = require('mongoose');

const ChatGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    file: { type: String }
  }],
  isPrivate: { type: Boolean, default: false }
});

module.exports = mongoose.model("ChatGroup", ChatGroupSchema);