const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const College = require('./models/college');
const Contact = require('./models/contact');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// --- MongoDB Connection ---
mongoose.set('bufferCommands', false);

mongoose.connect(`${config.get("MONGODB_URL")}/JOVAC_PROJECT`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
  });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// --- Routes ---

app.get('/', (req, res) => {
  res.render("home");
});
app.get('/index', (req, res) => {
  res.render("index");
});
app.get('/talkToUs',(req,res)=>{
  res.render("talk");
})
app.post('/talkToUs', async (req, res) => {
  try {
    const { name, mobile, email, subject, message } = req.body;

    const newMessage = new Contact({
      name,
      mobile,
      email,
      subject,
      message
    });

    await newMessage.save();

    res.send(`
      <script>
        alert("✅ Your message has been saved to the database!");
        window.location.href = "/talkToUs";
      </script>
    `);
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.send(`
      <script>
        alert("❌ Error saving message to database.");
        window.location.href = "/talkToUs";
      </script>
    `);
  }
});
app.post('/predict', async (req, res) => {
  try {
    const { rank, category, gender, counselling, homeState, pwd } = req.body;

    const categoryMap = {
      'GEN': 'OPEN',
      'OBC-NCL': 'OBC-NCL',
      'SC': 'SC',
      'ST': 'ST'
    };

    const resolvedCategory = categoryMap[category];
    const finalCategory = pwd ? `${resolvedCategory}-PwD` : resolvedCategory;

    const genderList = gender === 'Female'
  ? ['Gender-Neutral', 'Female-only (including Supernumerary)']
  : ['Gender-Neutral'];


    const numericRank = parseInt(rank);
    let quotaValues;

if (counselling === 'JoSAA') {
  quotaValues = ['HS', 'OS']; // JoSAA does not use 'AI'
} else if (counselling === 'CSAB') {
  quotaValues = ['AI', 'HS', 'OS']; // CSAB uses 'AI'
} else {
  quotaValues = ['HS', 'OS']; // default fallback
}


const queryConditions = {
  category: finalCategory,
  gender: { $in: genderList },
  quota: { $in: quotaValues },
  year: 2024,
  openingRank: { $lte: numericRank },
  closingRank: { $gte: numericRank }
};


    console.log("✅ Final Query Conditions:", queryConditions);
    console.log("🔍 Query Conditions:", JSON.stringify(queryConditions, null, 2));
    
    const testDoc = await College.findOne({});
console.log("📌 One College Doc:", testDoc);
const collections = await mongoose.connection.db.listCollections().toArray();
console.log("📂 Available Collections:", collections.map(c => c.name));


    // let colleges = await College.find(queryConditions).lean();
let colleges = await College.find({
  category: finalCategory, // e.g. 'OPEN', 'OBC-NCL', 'SC', 'ST', etc.
  gender: { $in: genderList }, // ['Gender-Neutral'] or ['Gender-Neutral', 'Female-only (including Supernumerary)']
  quota: { $in: quotaValues }, // ['AI', 'HS', 'OS'] ya ['HS', 'OS']
  year: 2024,
  openingRank: { $lte: numericRank }, // e.g. 8042
  closingRank: { $gte: numericRank }
});

console.log("🧪 Test Hardcoded Match:", colleges);

    console.log("📊 Found Colleges:", colleges.length);

    console.log("📦 Fetched from DB:", colleges.length);

    // JoSAA home state filter logic
if (counselling === 'JoSAA') {
  colleges = colleges.filter(clg => {
    if (clg.quota === 'HS') return clg.state === homeState;
    if (clg.quota === 'OS') return clg.state !== homeState;
    return false; // filter out others like AI (shouldn't be there anyway)
  });
}

console.log("📤 After JoSAA Home State filter:", colleges.length);



    // Sort results
    colleges.sort((a, b) => a.openingRank - b.openingRank);

    res.json(colleges.slice(0, 50));
  } catch (err) {
    console.error('❌ Prediction Error:', err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
