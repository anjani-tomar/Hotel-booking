import express from 'express';
import { pool } from '../index.js';

const router = express.Router();

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);
const isPhone = (v) => /^\+?\d{10,15}$/.test(v);


router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, phone, check_in as "checkIn", check_out as "checkOut", guests, room_type as "roomType", notes, created_at as "createdAt" FROM bookings ORDER BY created_at DESC'
    );
    return res.json({ items: rows });
  } catch (e) {
    console.error('GET /api/booking error', e);
    return res.status(500).json({ error: 'Failed to load' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, checkIn, checkOut, guests, roomType, notes } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });
    if (!isEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!isPhone(phone)) return res.status(400).json({ error: 'Valid phone is required' });
    if (!checkIn || !checkOut) return res.status(400).json({ error: 'Dates are required' });
    if (!guests || guests < 1) return res.status(400).json({ error: 'Guests must be >= 1' });

    const insert = `INSERT INTO bookings(name, email, phone, check_in, check_out, guests, room_type, notes)
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
                    RETURNING id, created_at`;
    const values = [
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      checkIn,
      checkOut,
      Number(guests),
      roomType || null,
      notes || null,
    ];
    const { rows } = await pool.query(insert, values);

    const rec = {
      id: rows[0].id,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      guests: Number(guests),
      roomType: roomType || null,
      notes: notes || null,
      createdAt: rows[0].created_at,
    };
    return res.json({ ok: true, booking: rec });
  } catch (e) {
    console.error('POST /api/booking error', e);
    return res.status(500).json({ error: 'Failed to create' });
  }
});

export default router;
