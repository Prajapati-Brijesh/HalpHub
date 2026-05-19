const mongoose = require('mongoose');
const Service = require('./models/Service');
const dotenv = require('dotenv');

dotenv.config();

const services = [
  {
    name: 'Professional Electrician',
    description: 'Expert electrical repairs, wiring, and installations.',
    price: 500,
    location: 'Ahmedabad',
    category: 'Electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'
  },
  {
    name: 'Expert Plumber',
    description: 'Leaking pipes, tap repairs, and bathroom fittings.',
    price: 400,
    location: 'Ahmedabad',
    category: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1976&auto=format&fit=crop'
  },
  {
    name: 'Home Cleaning',
    description: 'Deep cleaning for houses and offices.',
    price: 1200,
    location: 'Ahmedabad',
    category: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?q=80&w=2070&auto=format&fit=crop'
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    await Service.deleteMany({});
    await Service.insertMany(services);
    console.log('Database seeded successfully');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
