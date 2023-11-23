require("dotenv").config();
const mongoose = require("mongoose");
const Role = require("../models/role/role");

const data = [
  {
    role: "admin",
  },
  {
    role: "user",
  },
];

const seedRole = async () => {
  try {
    const db = process.env.DB_URL;
    console.log(process.env.DB_URL)
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Role.insertMany(data);
    console.log("Seed role success");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
}

seedRole();