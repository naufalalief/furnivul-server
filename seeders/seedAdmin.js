require('dotenv').config()
const mongoose = require('mongoose')
const Role = require('../models/role/role')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10

const seedAdmin = async () => {
  try{
    const db = process.env.DB_URL
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const adminRole = await Role.findOne({role: 'admin'})
    if (!adminRole) {
      console.log('Admin role not found')
      process.exit()
    }

    const addAdmin = new User({
      fullname: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin123', saltRounds),
      _idRole: adminRole._id
    })

    await addAdmin.save()

    console.log('Seed admin success')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
}

seedAdmin()