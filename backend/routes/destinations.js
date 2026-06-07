const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed dummy data
router.post('/seed', async (req, res) => {
  const dummyDestinations = [
    { name: 'Taj Mahal', state: 'Uttar Pradesh', city: 'Agra', category: 'Monument', description: 'Ivory-white marble mausoleum on the right bank of the river Yamuna.', rating: 4.9 },
    { name: 'Gateway of India', state: 'Maharashtra', city: 'Mumbai', category: 'Monument', description: 'Arch-monument built in the early 20th century.', rating: 4.7 }
  ];
  
  try {
    await Destination.deleteMany({});
    await Destination.insertMany(dummyDestinations);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during seeding' });
  }
});

module.exports = router;
