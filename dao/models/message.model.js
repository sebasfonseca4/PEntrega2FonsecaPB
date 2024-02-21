// dao/models/message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;
