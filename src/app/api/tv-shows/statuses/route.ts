import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TV_SHOW_API_URL = process.env.NEXT_PUBLIC_TV_SHOW_API_URL;
const TV_SHOW_API_KEY = process.env.NEXT_PUBLIC_TV_SHOW_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    // Forward query parameters
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('📡 Proxying TV show statuses request');

    const response = await axios.get(`${TV_SHOW_API_URL}/statuses`, {
      params,
      headers: {
        'X-API-Key': TV_SHOW_API_KEY,
        accept: 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('❌ Error proxying TV show statuses request:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, details: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
