import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const MOVIE_API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;
const MOVIE_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    console.log('📡 Proxying movie by ID request:', id);

    const response = await axios.get(`${MOVIE_API_URL}/movies/${id}`, {
      headers: {
        'X-API-Key': MOVIE_API_KEY,
        accept: 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('❌ Error proxying movie by ID request:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.message, details: error.response?.data }, { status: error.response?.status || 500 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
