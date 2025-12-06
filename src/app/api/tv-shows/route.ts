import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TV_SHOW_API_URL = process.env.NEXT_PUBLIC_TV_SHOW_API_URL;
const TV_SHOW_API_KEY = process.env.NEXT_PUBLIC_TV_SHOW_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward all query parameters to the external API
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('📡 Proxying TV shows request to:', `${TV_SHOW_API_URL}/shows`);

    const response = await axios.get(`${TV_SHOW_API_URL}/shows`, {
      params,
      headers: {
        'X-API-Key': TV_SHOW_API_KEY,
        'accept': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('❌ Error proxying TV shows request:', error);

    if (axios.isAxiosError(error)) {
      // If the error is 404 (no results found), return an empty data array
      // instead of an error to prevent UI errors
      if (error.response?.status === 404) {
        console.log('📝 No TV shows found, returning empty result');
        return NextResponse.json({
          data: [],
          meta: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
          }
        });
      }

      return NextResponse.json(
        { error: error.message, details: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📡 Proxying TV show creation to:', `${TV_SHOW_API_URL}/shows`);

    const response = await axios.post(`${TV_SHOW_API_URL}/shows`, body, {
      headers: {
        'X-API-Key': TV_SHOW_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating TV show:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.message, details: error.response?.data }, { status: error.response?.status || 500 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
