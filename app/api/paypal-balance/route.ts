import { NextResponse } from 'next/server';

// PayPal API response types
interface PayPalBalanceItem {
  currency: string;
  total_balance: {
    value: string;
    currency: string;
  };
}

interface PayPalBalanceResponse {
  balances?: PayPalBalanceItem[];
}

export async function GET() {
  try {
    // PayPal Sandbox API configuration
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.log('PayPal credentials not configured, returning mock data');
      // Return mock data if credentials aren't set
      const mockBalance = {
        balance: 125.50,
        currency: 'EUR',
        lastUpdated: new Date().toISOString(),
        accountEmail: 'sandbox@paypal.com',
        isMock: true
      };
      return NextResponse.json(mockBalance);
    }

    // PayPal API base URL
    const baseURL = PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get access token
    const tokenResponse = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get account balance
    const balanceResponse = await fetch(`${baseURL}/v1/reporting/balances`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!balanceResponse.ok) {
      throw new Error('Failed to get PayPal balance');
    }

    const balanceData: PayPalBalanceResponse = await balanceResponse.json();
    
    // Extract EUR balance (or first available currency)
    const eurBalance = balanceData.balances?.find((b: PayPalBalanceItem) => b.currency === 'EUR') || 
                      balanceData.balances?.[0] || 
                      { total_balance: { value: '0.00', currency: 'EUR' } };

    const balance = {
      balance: parseFloat(eurBalance.total_balance.value),
      currency: eurBalance.total_balance.currency,
      lastUpdated: new Date().toISOString(),
      accountEmail: process.env.PAYPAL_ACCOUNT_EMAIL || 'sandbox@paypal.com',
      isMock: false
    };

    return NextResponse.json(balance);
  } catch (error) {
    console.error('Error fetching PayPal balance:', error);
    
    // Return mock data on error for development
    const mockBalance = {
      balance: 125.50,
      currency: 'EUR',
      lastUpdated: new Date().toISOString(),
      accountEmail: 'sandbox@paypal.com',
      isMock: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    return NextResponse.json(mockBalance);
  }
}
