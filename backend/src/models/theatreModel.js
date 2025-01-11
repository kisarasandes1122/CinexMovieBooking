const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  location: { type: String, required: true }
});

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;