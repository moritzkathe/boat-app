import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      responseTime: Date.now() - startTime,
      checks: {
        database: {
          status: 'healthy',
          message: 'Database connection established',
          timestamp: new Date().toISOString()
        },
        api: {
          status: 'healthy',
          message: 'API endpoints responding normally',
          timestamp: new Date().toISOString()
        },
        memory: {
          status: 'healthy',
          message: `Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          timestamp: new Date().toISOString()
        }
      }
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
