// src/app/api/lists/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'utils/authOptions';
import pool from 'lib/db';

// GET /api/lists/:id - Get a specific list with all its items
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const listId = params.id;

    // Get the list details and verify ownership
    const listQuery = `
      SELECT
        list_id as id,
        title,
        list_type as type,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM top10_lists
      WHERE list_id = $1 AND user_id = $2
    `;

    const listResult = await pool.query(listQuery, [listId, userId]);

    if (listResult.rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const list = listResult.rows[0];

    // Get all items for this list
    const itemsQuery = `
      SELECT
        item_id as id,
        rank,
        content_id as "contentId",
        content_type as "contentType",
        title,
        poster_url as "posterUrl",
        added_at as "addedAt"
      FROM list_items
      WHERE list_id = $1
      ORDER BY rank ASC
    `;

    const itemsResult = await pool.query(itemsQuery, [listId]);

    // Create an array with all 10 ranks, filling empty slots
    const items = Array.from({ length: 10 }, (_, i) => {
      const rank = i + 1;
      const item = itemsResult.rows.find((item) => item.rank === rank);

      if (item) {
        return {
          rank,
          movieId: item.contentId,
          title: item.title,
          posterUrl: item.posterUrl,
          contentType: item.contentType
        };
      } else {
        return { rank };
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...list,
        items
      }
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
  }
}

// DELETE /api/lists/:id - Delete a list
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const listId = params.id;

    // Verify ownership and delete (CASCADE will handle list_items)
    const deleteQuery = `
      DELETE FROM top10_lists
      WHERE list_id = $1 AND user_id = $2
      RETURNING list_id
    `;

    const result = await pool.query(deleteQuery, [listId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'List deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
}

// PUT /api/lists/:id - Update list metadata (title, description)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const listId = params.id;
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Update the list
    const updateQuery = `
      UPDATE top10_lists
      SET title = $1, description = $2
      WHERE list_id = $3 AND user_id = $4
      RETURNING
        list_id as id,
        title,
        list_type as type,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const result = await pool.query(updateQuery, [title, description || null, listId, userId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
}
