const fs = require('fs');

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getImageUrl(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=pageimages&format=json&pithumbsize=800`, {
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
  const result = {};
  for(const state of states) {
    let img = await getImageUrl(state + ' tourism');
    await sleep(200);
    if (!img) { img = await getImageUrl(state + ' landmark'); await sleep(200); }
    if (!img) { img = await getImageUrl(state); await sleep(200); }
    result[state] = img || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg';
    console.log(state, img ? "OK" : "FAIL");
  }
  fs.writeFileSync('src/data/state_images.json', JSON.stringify(result, null, 2));
  console.log("Done");
}

run();
