-- Fix tract members policies
CREATE POLICY "Tract members can view their tract" ON tracts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM tract_members WHERE tract_id = id
        )
    );

CREATE POLICY "Tract members can update their tract" ON tracts
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM tract_members WHERE tract_id = id AND role = 'owner'
        )
    );

CREATE POLICY "Tract members can delete their tract" ON tracts
    FOR DELETE USING (
        auth.uid() IN (
            SELECT user_id FROM tract_members WHERE tract_id = id AND role = 'owner'
        )
    );

-- Fix tract policies
CREATE POLICY "Tract members can view tract members" ON tract_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM tract_members WHERE tract_id = tract_id
        )
    );

CREATE POLICY "Tract owners can manage members" ON tract_members
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM tract_members WHERE tract_id = tract_id AND role = 'owner'
        )
    ); 