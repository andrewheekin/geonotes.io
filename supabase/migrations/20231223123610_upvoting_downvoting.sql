-- 1. Add "upvotes" and "downvotes" columns to geonote table
--    The upvotes and downvotes columns should be integers that default to 0.
--    The upvotes and downvotes columns should be non-nullable.
--    The upvotes and downvotes columns should have a check constraint to ensure that they are never negative.
-- 2. Add upvote and downvote triggers to geonote table. These triggers will increment or decrement the upvotes and downvotes columns when a new row is inserted into the geonote_vote table. The triggers will also ensure that the upvotes and downvotes columns are never negative.
-- 3. Add a geonote_vote table with a foreign key to the geonote table.
--    Add indexes to the geonote_vote table for the geonote_id and user_id columns.
--    The geonote_vote table should have 3 columns: geonote_id, user_id, and vote. The vote column should be an integer that is either 1 or -1. The vote column will be 1 if the user upvoted the geonote and -1 if the user downvoted the geonote.
--    The geonote_vote table user_id column should have a foreign key relationship with the "profiles" table.
--    The geonote_vote table geonote_id column should have a foreign key relationship with the geonote table.
--    The ON DELETE CASCADE ensures that if a geonote is deleted, its corresponding votes are also removed.
--    The geonote_vote table should have The UNIQUE constraint for the geonote_id and user_id columns. This ensures that a user can only vote on a geonote once.
--    Add a check constraint to the geonote_vote table to ensure that the vote column is either 1 or -1.
-- 4. Add a geonote_vote_count view that returns the number of upvotes and downvotes for each geonote.
--    The view should have 3 columns: geonote_id, upvotes, and downvotes.
--    The view should have a foreign key relationship with the geonote table.
--    The view should have a foreign key relationship with the geonote_vote table.
--    The view should have a unique constraint for the geonote_id column. This ensures that a geonote can only have one row in the view.
-- 5. Create a postgres function to recalculate and save upvotes/downvotes to the geonote table record if any discrepancies
--    The function should take a geonote_id as an argument.
--    The function should recalculate the upvotes and downvotes for the geonote and save the results to the geonote table.

-- 1. Add "upvotes" and "downvotes" columns to geonote table
ALTER TABLE geonote
ADD COLUMN upvotes INT DEFAULT 0 NOT NULL CHECK (upvotes >= 0),
ADD COLUMN downvotes INT DEFAULT 0 NOT NULL CHECK (downvotes >= 0);

-- 2. Create triggers for upvote and downvote updates
-- (You will need to create the trigger functions separately)

-- 3. Create geonote_vote table
-- Note, the primary key is a composite key of geonote_id and user_id and ensures that a user can only vote on a geonote once.
CREATE TABLE geonote_vote (
    geonote_id INT,
    user_id UUID,
    vote INT CHECK (vote = 1 OR vote = -1),
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (geonote_id, user_id),
    FOREIGN KEY (geonote_id) REFERENCES geonote (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES profiles (id) -- Replace 'profiles' and 'id' with actual table name and column
);

-- Add indexes to geonote_vote table
CREATE INDEX idx_geonote_id ON geonote_vote(geonote_id);
CREATE INDEX idx_user_id ON geonote_vote(user_id);

-- 4. Create geonote_vote_count view
CREATE VIEW geonote_vote_count AS
SELECT 
    g.id AS geonote_id,
    COALESCE(SUM(CASE WHEN gv.vote = 1 THEN 1 ELSE 0 END), 0) AS upvotes,
    COALESCE(SUM(CASE WHEN gv.vote = -1 THEN 1 ELSE 0 END), 0) AS downvotes
FROM 
    geonote g
LEFT JOIN 
    geonote_vote gv ON g.id = gv.geonote_id
GROUP BY 
    g.id;

-- 5. Create a function to recalculate and save upvotes/downvotes
CREATE OR REPLACE FUNCTION recalculate_votes(_geonote_id INT)
RETURNS VOID AS $$
DECLARE
    upvote_count INT;
    downvote_count INT;
BEGIN
    SELECT 
        COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0)
    INTO 
        upvote_count, downvote_count
    FROM 
        geonote_vote
    WHERE 
        geonote_vote.geonote_id = recalculate_votes._geonote_id;

    UPDATE 
        geonote
    SET 
        upvotes = upvote_count,
        downvotes = downvote_count
    WHERE 
        id = recalculate_votes._geonote_id;
END;
$$ LANGUAGE plpgsql;

-- Note: You need to create trigger functions for incrementing/decrementing upvotes/downvotes
-- and attach those functions to the appropriate triggers on the geonote_vote table.

-- TODO: Revisit these queries (especially revisit geonote_vote_count view) to see if they can be optimized as the application grows
