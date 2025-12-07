import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const MOVIE_API_URL = process.env.NEXT_PUBLIC_MOVIE_API_URL;
const MOVIE_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward all query parameters to the external API
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const fullUrl = `${MOVIE_API_URL}/movies`;
    console.log("📡 Proxying movies request");
    console.log("📡 Full URL:", fullUrl);
    console.log("📡 Query params:", params);
    console.log("📡 API Key present:", !!MOVIE_API_KEY);

    const response = await axios.get(fullUrl, {
      params,
      headers: {
        "X-API-Key": MOVIE_API_KEY,
        accept: "application/json",
      },
    });

    console.log("✅ Movies API response status:", response.status);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error proxying movies request:", error);

    if (axios.isAxiosError(error)) {
      // If the error is 404 (no results found), return an empty data array
      // instead of an error to prevent UI errors
      if (error.response?.status === 404) {
        console.log("📝 No movies found, returning empty result");
        return NextResponse.json({
          data: [],
          meta: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0,
          },
        });
      }

      return NextResponse.json(
        { error: error.message, details: error.response?.data },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
