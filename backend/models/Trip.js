const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: String, enum: ['Budget', 'Moderate', 'Luxury'] },
  itinerary: [{
    day: Number,
    activities: [{
      time: String,
      description: String,
      location: String
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
