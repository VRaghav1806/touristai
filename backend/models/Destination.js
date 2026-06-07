const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Monument', 'Hill Station', 'Beach', 'Temple', 'Fort', 'Wildlife', 'Museum', 'Other'] },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  bestTimeToVisit: { type: String },
  rating: { type: Number, default: 4.5 },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
