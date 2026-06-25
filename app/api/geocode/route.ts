import { NextRequest, NextResponse } from 'next/server';
import { getOneMapToken } from '@/lib/onemap';

const ONEMAP_API = 'https://www.onemap.gov.sg/api/common/elastic/search';

interface GeocodeResult {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  try {
    const token = await getOneMapToken();

    const response = await fetch(
      `${ONEMAP_API}?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OneMap API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results: GeocodeResult[] = [];

    if (data.results && Array.isArray(data.results)) {
      for (const result of data.results.slice(0, 5)) {
        // OneMap returns SEARCHVAL, BUILDING (not BUILDING_NAME), ADDRESS, etc.
        const name =
          result.SEARCHVAL ||
          result.BUILDING ||
          result.ADDRESS ||
          result.ROAD_NAME ||
          'Location';

        results.push({
          name,
          lat: parseFloat(result.LATITUDE),
          lng: parseFloat(result.LONGITUDE),
          address: result.ADDRESS,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Geocode error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    );
  }
}
