-- =====================================================
-- Top 10 Lists Database Schema for PostgreSQL
-- Group 5 - Movie & TV Show Application
-- FIXED FOR DBEAVER - No external dependencies
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
-- Verification Query - Run this after creating tables
-- =====================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
