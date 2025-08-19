import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the latest PayPal balance from database
    const paypalBalance = await prisma.payPalBalance.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!paypalBalance) {
      // Return default if no balance exists
      return NextResponse.json({
        balance: 0.0,
        currency: 'EUR',
        lastUpdated: new Date().toISOString()
      });
    }

    return NextResponse.json({
      balance: paypalBalance.balance,
      currency: paypalBalance.currency,
      lastUpdated: paypalBalance.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching PayPal balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PayPal balance' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { balance } = body;

    if (typeof balance !== 'number' || balance < 0) {
      return NextResponse.json(
        { error: 'Invalid balance amount' },
        { status: 400 }
      );
    }

    // Create new balance record in database
    const newBalance = await prisma.payPalBalance.create({
      data: {
        balance,
        currency: 'EUR'
      }
    });

    return NextResponse.json({
      balance: newBalance.balance,
      currency: newBalance.currency,
      lastUpdated: newBalance.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating PayPal balance:', error);
    return NextResponse.json(
      { error: 'Failed to update PayPal balance' },
      { status: 500 }
    );
  }
}
