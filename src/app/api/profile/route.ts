import { NextResponse } from 'next/server';

// Simple demo profile endpoint for autofill
// GET /api/profile -> returns name, email, phone, and optional image URL
export async function GET() {
  // In a real app, derive user from session/auth and fetch from DB
  const profile = {
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    // Optional ID image URL; can be null if not available
    idImageUrl: null as string | null,
  };
  return NextResponse.json(profile);
}
