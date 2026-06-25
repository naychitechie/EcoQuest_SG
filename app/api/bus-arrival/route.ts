import { NextRequest, NextResponse } from 'next/server';

const LTA_BUS_ARRIVAL_API = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

interface BusArrivalInfo {
  serviceNo: string;
  operator: string;
  nextBus: {
    estimatedArrival: string;
    minutesAway: number | null;
    load: 'SEA' | 'SDA' | 'LSD' | '';
    type: string;
    feature: string;
  };
  nextBus2: {
    estimatedArrival: string;
    minutesAway: number | null;
    load: 'SEA' | 'SDA' | 'LSD' | '';
    type: string;
    feature: string;
  };
}

function parseArrivalTime(estimatedArrival: string): number | null {
  if (!estimatedArrival) return null;
  const arrivalTime = new Date(estimatedArrival).getTime();
  const now = Date.now();
  const minutesAway = Math.max(0, Math.round((arrivalTime - now) / 60000));
  return minutesAway;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stopCode = searchParams.get('stopCode');
  const serviceNo = searchParams.get('serviceNo');

  if (!stopCode) {
    return NextResponse.json(
      { error: 'Bus stop code is required' },
      { status: 400 }
    );
  }

  const ltaKey = process.env.LTA_KEY;
  if (!ltaKey) {
    return NextResponse.json(
      { error: 'LTA API key not configured' },
      { status: 500 }
    );
  }

  try {
    let url = `${LTA_BUS_ARRIVAL_API}?BusStopCode=${stopCode}`;
    if (serviceNo) {
      url += `&ServiceNo=${serviceNo}`;
    }

    const response = await fetch(url, {
      headers: {
        'AccountKey': ltaKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LTA API error: ${response.statusText}`);
    }

    const data = await response.json();

    const services: BusArrivalInfo[] = (data.Services || []).map((svc: Record<string, unknown>) => {
      const nextBus = svc.NextBus as Record<string, string> | undefined;
      const nextBus2 = svc.NextBus2 as Record<string, string> | undefined;

      return {
        serviceNo: svc.ServiceNo as string,
        operator: svc.Operator as string,
        nextBus: {
          estimatedArrival: nextBus?.EstimatedArrival || '',
          minutesAway: parseArrivalTime(nextBus?.EstimatedArrival || ''),
          load: (nextBus?.Load || '') as BusArrivalInfo['nextBus']['load'],
          type: nextBus?.Type || '',
          feature: nextBus?.Feature || '',
        },
        nextBus2: {
          estimatedArrival: nextBus2?.EstimatedArrival || '',
          minutesAway: parseArrivalTime(nextBus2?.EstimatedArrival || ''),
          load: (nextBus2?.Load || '') as BusArrivalInfo['nextBus']['load'],
          type: nextBus2?.Type || '',
          feature: nextBus2?.Feature || '',
        },
      };
    });

    return NextResponse.json({
      busStopCode: stopCode,
      services,
    });
  } catch (error) {
    console.error('Bus arrival error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bus arrivals' },
      { status: 500 }
    );
  }
}
