import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasLtaKey: !!process.env.LTA_KEY,
      hasOneMapToken: !!process.env.ONEMAP_TOKEN,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    },
  };

  return NextResponse.json(health);
}
