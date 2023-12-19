-- This script creates the geonote_category_mapping table and sets up a foreign key relationship with the geonote table.
-- The ON DELETE CASCADE ensures that if a geonote is deleted, its corresponding mappings are also removed.
-- The UNIQUE constraint ensures that a geonote can only be mapped to a category once.
CREATE TABLE geonote_category_mapping (
    geonote_id INTEGER NOT NULL,
    category_name TEXT NOT NULL,
    FOREIGN KEY (geonote_id) REFERENCES geonote(id) ON DELETE CASCADE,
    UNIQUE (geonote_id, category_name)
);

