const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get("MONGODB_URL") + "/JOVAC_PROJECT", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB connection error:", err));
