const fs = require('fs');
const path = require('path');

const csvPath = 'e:/touristai/India_Tourism_Images.csv';
const jsonPath = 'e:/touristai/frontend/src/data/state_images.json';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getImageUrl(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&format=json&pithumbsize=800`, {
      headers: {
        'User-Agent': 'TouristAI/1.0 (contact@touristai.com) Node.js'
      }
    });
    const data = await res.json();
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages);
      for (const p of pages) {
        if (p.thumbnail && p.thumbnail.source) return p.thumbnail.source;
      }
    }
  } catch(e) {}
  return null;
}

async function run() {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim() && !l.startsWith('State'));
  
  let stateImages = {};
  if (fs.existsSync(jsonPath)) {
    stateImages = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  }
  
  for(const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      const state = parts[0].trim();
      const place = parts[1].trim();
      
      let img = await getImageUrl(place);
      await sleep(200);
      if (!img) { img = await getImageUrl(place + ' landmark'); await sleep(200); }
      
      if (img) {
        stateImages[state] = img;
        console.log(`Updated ${state} with ${place}`);
      } else {
        console.log(`Failed to find image for ${place} in ${state}`);
      }
    }
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(stateImages, null, 2));
  console.log("Done updating JSON from CSV!");
}

run();
