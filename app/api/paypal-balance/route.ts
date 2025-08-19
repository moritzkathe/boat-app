import { NextResponse } from 'next/server';

// In-memory storage (in production, you'd use a database)
let paypalBalance = {
  balance: 125.50,
  currency: 'EUR',
  lastUpdated: new Date().toISOString(),
  accountEmail: 'your-paypal@example.com'
};

export async function GET() {
  return NextResponse.json(paypalBalance);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { balance, accountEmail } = body;

    if (typeof balance !== 'number' || balance < 0) {
      return NextResponse.json(
        { error: 'Invalid balance amount' },
        { status: 400 }
      );
    }

    // Update the balance
    paypalBalance = {
      balance,
      currency: 'EUR',
      lastUpdated: new Date().toISOString(),
      accountEmail: accountEmail || paypalBalance.accountEmail
    };

    return NextResponse.json(paypalBalance);
  } catch (error) {
    console.error('Error updating PayPal balance:', error);
    return NextResponse.json(
      { error: 'Failed to update PayPal balance' },
      { status: 500 }
    );
  }
}
