import express from 'express';
import Service from '../models/Service.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('vendorId', 'name email');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get services by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const services = await Service.find({ categoryId: req.params.categoryId }).populate('vendorId', 'name email');
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a service (Vendor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Only vendors can add services' });
  }

  const { name, categoryId, description, price, location, image } = req.body;
  try {
    const newService = new Service({
      name,
      categoryId,
      description,
      price,
      location,
      image,
      vendorId: req.user.id
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
