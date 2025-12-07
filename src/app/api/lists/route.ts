// src/app/api/lists/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'utils/authOptions';
import pool from 'lib/db';

// GET /api/lists - Fetch all lists for the logged-in user
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;

    // Query to get all lists for this user
    const listsQuery = `
      SELECT
        list_id as id,
        title,
        list_type as type,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM top10_lists
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const listsResult = await pool.query(listsQuery, [userId]);

    // For each list, count how many items it has
    const listsWithCounts = await Promise.all(
      listsResult.rows.map(async (list) => {
        const countQuery = `
          SELECT COUNT(*) as count
          FROM list_items
          WHERE list_id = $1
        `;
        const countResult = await pool.query(countQuery, [list.id]);

        return {
          ...list,
          itemCount: parseInt(countResult.rows[0].count),
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: listsWithCounts,
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 },
    );
  }
}

// POST /api/lists - Create a new list
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const body = await request.json();
    const { title, type, description } = body;

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 },
      );
    }

    // Validate type
    if (!['movies', 'tv-shows', 'mixed'].includes(type)) {
      return NextResponse.json({ error: 'Invalid list type' }, { status: 400 });
    }

    // Insert the new list
    const insertQuery = `
      INSERT INTO top10_lists (user_id, title, list_type, description)
      VALUES ($1, $2, $3, $4)
      RETURNING
        list_id as id,
        title,
        list_type as type,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query(insertQuery, [
      userId,
      title,
      type,
      description || null,
    ]);

    const newList = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newList,
          itemCount: 0,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 },
    );
  }
}
