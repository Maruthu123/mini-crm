const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost:27017/mini-crm");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);

async function createUser() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const user = new User({
    name: "Admin",
    email: "admin@minicrm.com",
    password: hashedPassword
  });

  await user.save();
  console.log("✅ User created");

  mongoose.disconnect();
}

createUser();