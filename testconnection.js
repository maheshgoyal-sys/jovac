const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/JOVAC_PROJECT', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
  mongoose.connection.close(); // Close after success
})
.catch((err) => {
  console.log("❌ Error Connecting to MongoDB:", err);
});
