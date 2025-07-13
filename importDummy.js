const mongoose = require('mongoose');
const College = require('./models/college'); // Make sure path is correct

const dummyData = [
  {
    collegeName: "NIT Trichy",
    branch: "CSE",
    state: "Tamil Nadu",
    category: "GEN",
    gender: "Gender-Neutral",
    quota: "OS",
    year: 2023,
    openingRank: 100,
    closingRank: 5000
  },
  {
    collegeName: "NIT Jaipur",
    branch: "Electrical",
    state: "Rajasthan",
    category: "OBC-NCL",
    gender: "Gender-Neutral",
    quota: "HS",
    year: 2023,
    openingRank: 2000,
    closingRank: 10000
  }
];

mongoose.connect('mongodb://localhost:27017/Jovac_Project')
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    await College.deleteMany({}); // Clear old data
    await College.insertMany(dummyData); // Insert new dummy data

    console.log("✅ Dummy colleges inserted!");
    mongoose.disconnect();
  })
  .catch(err => console.error("❌ Error:", err));
