const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const emailToPromote = 'admin@helphub.com';

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate({ email: emailToPromote }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`User ${emailToPromote} promoted to admin`);
    } else {
      console.log(`User ${emailToPromote} not found. Creating admin user...`);
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = new User({
        name: 'Super Admin',
        email: emailToPromote,
        password: hashedPassword,
        role: 'admin'
      });
      await newUser.save();
      console.log('Admin user created: admin@helphub.com / admin123');
    }
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
