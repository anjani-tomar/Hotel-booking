import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

import contactRouter from './routes/contact.js';
import chatRouter from './routes/chat.js';
import bookingRouter from './routes/booking.js';
import suitesRouter from './routes/suites.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN, credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

// Database (PostgreSQL)
const { Pool } = pkg;
// Build a valid Postgres connection string
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
  if (PGHOST && PGDATABASE && PGUSER && typeof PGPASSWORD === 'string') {
    const encUser = encodeURIComponent(PGUSER);
    const encPass = encodeURIComponent(PGPASSWORD);
    const port = PGPORT || 5432;
    connectionString = `postgres://${encUser}:${encPass}@${PGHOST}:${port}/${PGDATABASE}`;
  }
}

if (!connectionString) {
  console.error('Failed to start server: DATABASE_URL is not set and could not be constructed from PG* variables (PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD).');
  process.exit(1);
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'require' ? { rejectUnauthorized: false } : undefined,
});

async function createTables() {
  // Create tables if they don't exist
  let client;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER NOT NULL CHECK (guests >= 1),
        room_type TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } catch (err) {
    // If database does not exist, try to create it and retry once
    if (err && err.code === '3D000') {
      try {
        const url = new URL(connectionString);
        const targetDb = url.pathname?.replace(/^\//, '') || process.env.PGDATABASE;
        if (!targetDb) throw new Error('Target database name could not be determined');
        // connect to default 'postgres' database
        url.pathname = '/postgres';
        const adminPool = new Pool({
          connectionString: url.toString(),
          ssl: process.env.PGSSL === 'require' ? { rejectUnauthorized: false } : undefined,
        });
        const adminClient = await adminPool.connect();
        try {
          await adminClient.query(`CREATE DATABASE ${JSON.stringify(targetDb).slice(1, -1)};`);
        } catch (e) {
          // 42P04 = duplicate_database
          if (e.code !== '42P04') throw e;
        } finally {
          adminClient.release();
          await adminPool.end();
        }
        // retry original connection and table creation once
        client = await pool.connect();
        await client.query('SELECT 1');
        await client.query(`
          CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            guests INTEGER NOT NULL CHECK (guests >= 1),
            room_type TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
      } catch (inner) {
        throw inner;
      }
    } else {
      throw err;
    }
  } finally {
    if (client) client.release();
  }
}

// Routes
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/contact', contactRouter);
app.use('/api/chat', chatRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/suites', suitesRouter);

createTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
