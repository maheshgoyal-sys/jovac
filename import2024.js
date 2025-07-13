const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const College = require('./models/college');

// 🧠 Only 2024
const year = 2024;

// 📍 Function to get state from college name
function getStateFromCollegeName(name) {
  const knownStates = {
    "Rajasthan": "Rajasthan", "Tamil Nadu": "Tamil Nadu", "Delhi": "Delhi",
    "Uttar Pradesh": "Uttar Pradesh", "West Bengal": "West Bengal",
    "Telangana": "Telangana", "Andhra Pradesh": "Andhra Pradesh",
    "Punjab": "Punjab", "Gujarat": "Gujarat", "Assam": "Assam", "Bihar": "Bihar",
    "Madhya Pradesh": "Madhya Pradesh", "Maharashtra": "Maharashtra",
    "Karnataka": "Karnataka", "Odisha": "Odisha", "Kerala": "Kerala",
    "Chhattisgarh": "Chhattisgarh", "Himachal Pradesh": "Himachal Pradesh",
    "Jammu": "Jammu and Kashmir", "Ladakh": "Ladakh"
  };

  for (let keyword in knownStates) {
    if (name.includes(keyword)) return knownStates[keyword];
  }
  return "Unknown";
}

async function import2024Rounds() {
  await mongoose.connect('mongodb://localhost:27017/Jovac_Project');
  console.log("✅ MongoDB connected");

  await College.deleteMany({ year: 2024 });
  console.log("🧹 2024 data cleared");

  let allData = [];

  for (let round = 1; round <= 6; round++) {
    const filePath = path.join(__dirname, `JoSAA-DataSet/2024/round${round}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      continue;
    }

    const raw = require(filePath);

    const mapped = raw.map(entry => ({
      collegeName: entry[0],
      branch: entry[1],
      quota: entry[2],
      category: entry[3],
      gender: entry[4],
      openingRank: isNaN(entry[5]) ? -1 : Number(entry[5].replace("P", "")),
      closingRank: isNaN(entry[6]) ? -1 : Number(entry[6].replace("P", "")),
      state: getStateFromCollegeName(entry[0]),
      year: year
    }));

    allData = allData.concat(mapped);
    console.log(`📦 Loaded ${mapped.length} from Round ${round}`);
  }

  if (allData.length > 0) {
    await College.insertMany(allData);
    console.log(`✅ Inserted ${allData.length} records for 2024`);
  } else {
    console.log("⚠️ No data loaded");
  }

  await mongoose.disconnect();
  console.log("🔌 MongoDB disconnected");
}

import2024Rounds();
