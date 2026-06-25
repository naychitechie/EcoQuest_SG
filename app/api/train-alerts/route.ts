import { NextResponse } from 'next/server';

const LTA_TRAIN_ALERTS_API = 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts';

interface TrainDisruption {
  line: string;
  direction: string;
  stations: string;
  freePublicBus: boolean;
  freeMRTShuttle: boolean;
  message: string;
  createdDate: string;
}

export async function GET() {
  const ltaKey = process.env.LTA_KEY;
  if (!ltaKey) {
    return NextResponse.json(
      { error: 'LTA API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(LTA_TRAIN_ALERTS_API, {
      headers: {
        'AccountKey': ltaKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LTA API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle both array and object response shapes
    const alertData = Array.isArray(data.value) ? data.value[0] : data.value;

    if (!alertData) {
      return NextResponse.json({ status: 1, disruptions: [] });
    }

    const status: number = alertData.Status || 1;
    const disruptions: TrainDisruption[] = [];

    if (status === 2 && alertData.AffectedSegments) {
      const messages = alertData.Message || [];

      for (const segment of alertData.AffectedSegments) {
        const matchingMessage = messages.find(
          (m: Record<string, string>) => m.Content?.includes(segment.Line)
        );

        disruptions.push({
          line: segment.Line || '',
          direction: segment.Direction || '',
          stations: segment.Stations || '',
          freePublicBus: segment.FreePublicBus === 'Yes',
          freeMRTShuttle: segment.FreeMRTShuttle === 'Yes',
          message: matchingMessage?.Content || `Service disruption on ${segment.Line}`,
          createdDate: matchingMessage?.CreatedDate || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ status, disruptions });
  } catch (error) {
    console.error('Train alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch train alerts' },
      { status: 500 }
    );
  }
}
