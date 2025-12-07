// src/app/api/lists/[id]/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'utils/authOptions';
import pool from 'lib/db';

// POST /api/lists/:id/items - Add or update an item in a list
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const { id: listId } = await params;
    const body = await request.json();
    const { rank, contentId, contentType, title, posterUrl } = body;

    // Validate required fields
    if (!rank || !contentId || !contentType || !title) {
      return NextResponse.json(
        {
          error: 'Missing required fields: rank, contentId, contentType, title',
        },
        { status: 400 },
      );
    }

    // Validate rank is between 1-10
    if (rank < 1 || rank > 10) {
      return NextResponse.json(
        { error: 'Rank must be between 1 and 10' },
        { status: 400 },
      );
    }

    // Validate content type
    if (!['movie', 'tv-show'].includes(contentType)) {
      return NextResponse.json(
        { error: 'Content type must be "movie" or "tv-show"' },
        { status: 400 },
      );
    }

    // Verify list ownership
    const listQuery = `
      SELECT list_id, list_type
      FROM top10_lists
      WHERE list_id = $1 AND user_id = $2
    `;
    const listResult = await pool.query(listQuery, [listId, userId]);

    if (listResult.rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const list = listResult.rows[0];

    // Validate content type matches list type
    if (list.list_type === 'movies' && contentType !== 'movie') {
      return NextResponse.json(
        { error: 'This list only accepts movies' },
        { status: 400 },
      );
    }
    if (list.list_type === 'tv-shows' && contentType !== 'tv-show') {
      return NextResponse.json(
        { error: 'This list only accepts TV shows' },
        { status: 400 },
      );
    }

    // Check if an item already exists at this rank
    const existingItemQuery = `
      SELECT item_id
      FROM list_items
      WHERE list_id = $1 AND rank = $2
    `;
    const existingItemResult = await pool.query(existingItemQuery, [
      listId,
      rank,
    ]);

    if (existingItemResult.rows.length > 0) {
      // Update existing item
      const updateQuery = `
        UPDATE list_items
        SET content_id = $1, content_type = $2, title = $3, poster_url = $4
        WHERE list_id = $5 AND rank = $6
        RETURNING
          item_id as id,
          rank,
          content_id as "contentId",
          content_type as "contentType",
          title,
          poster_url as "posterUrl",
          added_at as "addedAt"
      `;
      const updateResult = await pool.query(updateQuery, [
        contentId,
        contentType,
        title,
        posterUrl || null,
        listId,
        rank,
      ]);

      return NextResponse.json({
        success: true,
        data: updateResult.rows[0],
        message: 'Item updated successfully',
      });
    } else {
      // Insert new item
      const insertQuery = `
        INSERT INTO list_items (list_id, rank, content_id, content_type, title, poster_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          item_id as id,
          rank,
          content_id as "contentId",
          content_type as "contentType",
          title,
          poster_url as "posterUrl",
          added_at as "addedAt"
      `;
      const insertResult = await pool.query(insertQuery, [
        listId,
        rank,
        contentId,
        contentType,
        title,
        posterUrl || null,
      ]);

      return NextResponse.json(
        {
          success: true,
          data: insertResult.rows[0],
          message: 'Item added successfully',
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error('Error adding/updating list item:', error);
    return NextResponse.json(
      { error: 'Failed to add/update item' },
      { status: 500 },
    );
  }
}

// DELETE /api/lists/:id/items?rank=X - Remove an item from a specific rank
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const { id: listId } = await params;
    const { searchParams } = new URL(request.url);
    const rank = searchParams.get('rank');

    if (!rank) {
      return NextResponse.json(
        { error: 'Rank parameter is required' },
        { status: 400 },
      );
    }

    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum < 1 || rankNum > 10) {
      return NextResponse.json(
        { error: 'Rank must be a number between 1 and 10' },
        { status: 400 },
      );
    }

    // Verify list ownership
    const listQuery = `
      SELECT list_id
      FROM top10_lists
      WHERE list_id = $1 AND user_id = $2
    `;
    const listResult = await pool.query(listQuery, [listId, userId]);

    if (listResult.rows.length === 0) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    // Delete the item at this rank
    const deleteQuery = `
      DELETE FROM list_items
      WHERE list_id = $1 AND rank = $2
      RETURNING item_id
    `;
    const deleteResult = await pool.query(deleteQuery, [listId, rankNum]);

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No item found at this rank' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed successfully',
    });
  } catch (error) {
    console.error('Error deleting list item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 },
    );
  }
}
