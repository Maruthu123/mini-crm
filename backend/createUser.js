const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect using env (IMPORTANT)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
  });

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const user = new User({
      name: "Admin",
      email: "admin@minicrm.com",
      password: hashedPassword,
    });

    await user.save();

    console.log("✅ User created successfully");

    mongoose.disconnect();
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

createUser();