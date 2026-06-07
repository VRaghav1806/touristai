const fs = require('fs');

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'];

async function fetchImages() {
  const result = {};
  for (const state of states) {
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(state + ' tourism')}&gsrlimit=5&prop=pageimages&format=json&pithumbsize=800`);
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageWithThumb = Object.values(pages).find(p => p.thumbnail?.source);
        if (pageWithThumb) {
          result[state] = pageWithThumb.thumbnail.source;
          console.log(`Found for ${state}`);
          continue;
        }
      }
      
      const res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(state + ' landmark')}&gsrlimit=5&prop=pageimages&format=json&pithumbsize=800`);
      const data2 = await res2.json();
      const pages2 = data2.query?.pages;
      if (pages2) {
        const pageWithThumb2 = Object.values(pages2).find(p => p.thumbnail?.source);
        if (pageWithThumb2) {
          result[state] = pageWithThumb2.thumbnail.source;
          console.log(`Found fallback for ${state}`);
          continue;
        }
      }
      
      console.log(`Still missing for ${state}`);
      result[state] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg';
    } catch (e) {
      result[state] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg';
    }
  }
  fs.writeFileSync('src/data/state_images.json', JSON.stringify(result, null, 2));
  console.log('Done writing src/data/state_images.json');
}

fetchImages();
