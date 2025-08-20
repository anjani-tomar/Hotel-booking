import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('[DB] DATABASE_URL is not set. Please configure .env.local');
}

export const pool = new Pool({ connectionString });

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>{
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return { rows: res.rows as T[] };
  } finally {
    client.release();
  }
}

export async function ensureSchema() {
  await query(`
    create table if not exists bookings (
      id text primary key,
      user_id text not null,
      hotel_id text not null,
      check_in timestamptz not null,
      check_out timestamptz not null,
      guests int default 1,
      status text not null default 'PENDING',
      amount numeric not null,
      payment_method text,
      transaction_id text,
      name text,
      email text,
      phone text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists payments (
      transaction_id text primary key,
      booking_id text not null references bookings(id) on delete cascade,
      method text not null,
      status text not null default 'PENDING',
      amount numeric not null,
      qr_image_url text,
      provider_ref text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
}
