import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
import { io } from '../index.js';

const router = express.Router();

// Get bookings for logged in user (User or Vendor)
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'vendor') {
      bookings = await Booking.find({ vendorId: req.user.id }).populate('serviceId userId', 'name email');
    } else {
      bookings = await Booking.find({ userId: req.user.id }).populate('serviceId vendorId', 'name email');
    }
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a booking
router.post('/', auth, async (req, res) => {
  const { serviceId, vendorId, date, amount } = req.body;
  try {
    const newBooking = new Booking({
      userId: req.user.id,
      serviceId,
      vendorId,
      date,
      amount
    });

    const booking = await newBooking.save();
    
    // Real-time notification to Vendor
    io.to(vendorId.toString()).emit('new_booking', {
      msg: 'You have a new booking request!',
      bookingId: booking._id
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update booking status
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    // Only vendor or admin can update status
    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    booking.status = status;
    await booking.save();

    // Notification to User
    io.to(booking.userId.toString()).emit('booking_update', {
      msg: `Your booking status has been updated to: ${status}`,
      bookingId: booking._id,
      status
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
