const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
