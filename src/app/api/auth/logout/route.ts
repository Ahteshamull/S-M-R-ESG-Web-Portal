import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the cookie that might have been set as HttpOnly by the local backend previously
  response.cookies.set({
    name: 'esg_auth_token',
    value: '',
    expires: new Date(0),
    path: '/',
  });
  
  return response;
}
