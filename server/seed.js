import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';

dotenv.config();

const vendors = [
  { name: 'Prasad Dairy Farm', email: 'prasad@dairy.com', password: 'password123', role: 'vendor', location: 'Jehanabad, Bihar' },
  { name: 'Rajinder Tractor', email: 'rajinder@tractor.com', password: 'password123', role: 'vendor', location: 'Patna, Bihar' },
  { name: 'Sharma Bricks', email: 'sharma@bricks.com', password: 'password123', role: 'vendor', location: 'Nawada, Bihar' }
];

const services = [
  { name: 'Fresh Buffalo Milk', categoryId: 'dairy', price: '₹50 / Ltr', location: 'Jehanabad', image: 'https://images.unsplash.com/photo-1550583724-125581f77833?q=80&w=400', description: 'Pure organic milk delivery.' },
  { name: 'Tractor Tilling', categoryId: 'tractor', price: '₹800 / Hr', location: 'Patna', image: 'https://images.unsplash.com/photo-1595015610410-a4a460391b0d?q=80&w=400', description: 'Modern tractors for farm use.' },
  { name: 'Red Bricks Supply', categoryId: 'bricks', price: '₹7,500 / 1000', location: 'Nawada', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=400', description: 'A-grade kiln bricks.' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for seeding...');

    await User.deleteMany({ role: 'vendor' });
    await Service.deleteMany({});

    for (let v of vendors) {
      const newUser = new User(v);
      const savedUser = await newUser.save();
      
      // Add a service for this vendor
      const serviceData = services.find(s => s.categoryId === (v.name.toLowerCase().includes('dairy') ? 'dairy' : v.name.toLowerCase().includes('tractor') ? 'tractor' : 'bricks'));
      if (serviceData) {
        const newService = new Service({ ...serviceData, vendorId: savedUser._id });
        await newService.save();
      }
    }

    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
