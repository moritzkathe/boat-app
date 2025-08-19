import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fallback in-memory storage for when database is not ready
let fallbackBalance = {
  balance: 0.0,
  currency: 'EUR',
  lastUpdated: new Date().toISOString()
};

export async function GET() {
  try {
    // Get the latest PayPal balance from database
    const paypalBalance = await prisma.payPalBalance.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!paypalBalance) {
      // Return fallback balance if no database record exists
      return NextResponse.json({
        ...fallbackBalance,
        note: 'Using temporary storage until database is ready'
      });
    }

    return NextResponse.json({
      balance: paypalBalance.balance,
      currency: paypalBalance.currency,
      lastUpdated: paypalBalance.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching PayPal balance:', error);
    // Fallback to in-memory storage if database is not ready
    return NextResponse.json({
      ...fallbackBalance,
      note: 'Using temporary storage until database is ready'
    });
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

    try {
      // Try to create new balance record in database
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
    } catch (dbError) {
      console.log('Database not ready, using fallback storage');
      
      // Use fallback in-memory storage
      fallbackBalance = {
        balance,
        currency: 'EUR',
        lastUpdated: new Date().toISOString()
      };

      return NextResponse.json({
        ...fallbackBalance,
        note: 'Using temporary storage until database is ready'
      });
    }
  } catch (error) {
    console.error('Error updating PayPal balance:', error);
    
    // Check if it's a database schema error (table doesn't exist)
    if (error instanceof Error && error.message.includes('table') && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database schema not ready yet. Please try again in a few minutes.',
          details: 'The PayPal balance table is being created. This happens automatically on first deployment.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update PayPal balance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
