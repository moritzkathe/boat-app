import { NextResponse } from 'next/server';

// CORS headers for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Helper function to add CORS headers to responses
export function addCorsHeaders(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Handle preflight OPTIONS requests
export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
