-- 1. Add upvotes and downvotes columns to geonote table
ALTER TABLE geonote
ADD COLUMN upvotes INT DEFAULT 0 NOT NULL CHECK (upvotes >= 0),
ADD COLUMN downvotes INT DEFAULT 0 NOT NULL CHECK (downvotes >= 0);


-- 2.  Add a geonote_vote table with a foreign key to the geonote table.
-- Note, the primary key is a composite key of geonote_id and user_id and ensures that a user can only vote on a geonote once.
CREATE TABLE geonote_vote (
    geonote_id INT,
    user_id UUID,
    vote INT, -- removing check constraint for value. CHECK (vote = 1 OR vote = -1),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (geonote_id, user_id),
    FOREIGN KEY (geonote_id) REFERENCES geonote (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles (id) -- Replace 'profiles' and 'id' with actual table name and column
);

-- Add indexes to geonote_vote table
CREATE INDEX idx_geonote_id ON geonote_vote(geonote_id);
CREATE INDEX idx_user_id ON geonote_vote(user_id);

-- 3. Create geonote_vote_count view
CREATE VIEW geonote_vote_count AS
SELECT 
    g.id AS geonote_id,
    COALESCE(SUM(CASE WHEN gv.vote > 0 THEN gv.vote ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN gv.vote < 0 THEN -gv.vote ELSE 0 END), 0) AS downvotes
FROM 
    geonote g
LEFT JOIN 
    geonote_vote gv ON g.id = gv.geonote_id
GROUP BY 
    g.id;

-- TODO: Revisit these queries (especially revisit geonote_vote_count view) to see if they can be optimized as the application grows
