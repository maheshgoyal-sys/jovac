const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get("MONGODB_URL");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));
