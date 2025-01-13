const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  location: { type: String, required: true }
});

// Virtual populate for screens
theatreSchema.virtual('screens', {
  ref: 'Screens',
  localField: '_id',
  foreignField: 'theatreId'
});

// Enable virtual population to be included in the output by default
theatreSchema.set('toObject', { virtuals: true });
theatreSchema.set('toJSON', { virtuals: true });

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;