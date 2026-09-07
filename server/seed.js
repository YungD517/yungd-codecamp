const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedTutor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if tutor already exists
    const existing = await User.findOne({ role: "tutor" });
    if (existing) {
      console.log("Tutor account already exists:");
      console.log(`  Name: ${existing.name}`);
      console.log(`  Email: ${existing.email}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create tutor account
    // CHANGE THESE CREDENTIALS BEFORE RUNNING
    const tutor = await User.create({
      name: "YungD",
      email: "fawazyunusayoola@gmail.com",
      password: "YF517@delly",
      role: "tutor",
    });

    console.log("Tutor account created successfully:");
    console.log(`  Name: ${tutor.name}`);
    console.log(`  Email: ${tutor.email}`);
    console.log(`  Role: ${tutor.role}`);
    console.log("\n⚠️  IMPORTANT: Change the password in this file before running!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedTutor();
