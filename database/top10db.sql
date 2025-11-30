-- =====================================================
-- Top 10 Lists Database Schema for PostgreSQL
-- Group 5 - Movie & TV Show Application
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS list_items CASCADE;
DROP TABLE IF EXISTS top10_lists CASCADE;

-- =====================================================
-- Table: top10_lists
-- Stores user-created Top 10 lists
-- =====================================================
CREATE TABLE top10_lists (
    list_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    list_type VARCHAR(50) NOT NULL CHECK (list_type IN ('movies', 'tv-shows', 'mixed')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Index for faster queries by user
CREATE INDEX idx_top10_lists_user_id ON top10_lists(user_id);

-- Index for faster queries by type
CREATE INDEX idx_top10_lists_type ON top10_lists(list_type);

-- Index for faster queries by created date
CREATE INDEX idx_top10_lists_created_at ON top10_lists(created_at DESC);

-- =====================================================
-- Table: list_items
-- Stores individual items (movies/shows) in each list
-- with their rank (1-10)
-- =====================================================
CREATE TABLE list_items (
    item_id SERIAL PRIMARY KEY,
    list_id INTEGER NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 10),
    content_id INTEGER NOT NULL,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('movie', 'tv-show')),
    title VARCHAR(255) NOT NULL,
    poster_url TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_list
        FOREIGN KEY (list_id)
        REFERENCES top10_lists(list_id)
        ON DELETE CASCADE,

    -- Ensure each rank is unique within a list
    CONSTRAINT unique_rank_per_list
        UNIQUE (list_id, rank)
);

-- Index for faster queries by list
CREATE INDEX idx_list_items_list_id ON list_items(list_id);

-- Index for faster queries by rank
CREATE INDEX idx_list_items_rank ON list_items(list_id, rank);

-- =====================================================
-- Function: Update the updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on top10_lists
CREATE TRIGGER update_top10_lists_updated_at
    BEFORE UPDATE ON top10_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Uncomment the lines below if you want to insert sample data
-- Note: Make sure the user_id values match existing users in your users table

-- INSERT INTO top10_lists (user_id, title, list_type, description) VALUES
-- (1, 'My Favorite Sci-Fi Movies', 'movies', 'The best science fiction films of all time'),
-- (1, 'Best Horror Films', 'movies', 'Movies that scared me the most'),
-- (1, 'Top Comedy Shows', 'tv-shows', 'TV shows that always make me laugh');

-- INSERT INTO list_items (list_id, rank, content_id, content_type, title, poster_url) VALUES
-- (1, 1, 18, 'movie', 'Inception', '/inception-poster.jpg'),
-- (1, 2, 127, 'movie', 'The Matrix', '/matrix-poster.jpg'),
-- (1, 3, 101, 'movie', 'Interstellar', '/interstellar-poster.jpg');

-- =====================================================
-- Useful Queries
-- =====================================================

-- Get all lists for a specific user
-- SELECT * FROM top10_lists WHERE user_id = 1 ORDER BY created_at DESC;

-- Get a specific list with all its items
-- SELECT
--     l.*,
--     json_agg(
--         json_build_object(
--             'rank', i.rank,
--             'title', i.title,
--             'content_id', i.content_id,
--             'content_type', i.content_type,
--             'poster_url', i.poster_url
--         ) ORDER BY i.rank
--     ) as items
-- FROM top10_lists l
-- LEFT JOIN list_items i ON l.list_id = i.list_id
-- WHERE l.list_id = 1
-- GROUP BY l.list_id;

-- Get item count for each list
-- SELECT
--     l.list_id,
--     l.title,
--     COUNT(i.item_id) as item_count
-- FROM top10_lists l
-- LEFT JOIN list_items i ON l.list_id = i.list_id
-- GROUP BY l.list_id, l.title;

-- Delete a list (will cascade delete all items)
-- DELETE FROM top10_lists WHERE list_id = 1;

-- =====================================================
-- Grants (adjust based on your database user setup)
-- =====================================================

-- Grant permissions to your application database user
-- Replace 'your_app_user' with your actual database user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON top10_lists TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON list_items TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE top10_lists_list_id_seq TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE list_items_item_id_seq TO your_app_user;
