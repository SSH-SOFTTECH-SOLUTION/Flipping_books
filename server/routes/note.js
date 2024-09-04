// routes/note.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET notes
router.get('/', async (req, res) => {
    const { user_id } = req.body;
    
    try {
        const query = 'SELECT * FROM note WHERE id = $1';
        const values = [user_id];
        const result = await pool.query(query, values);

// GET ALL notes at a tiime 
    //   const query = 'SELECT *FROM note ';
    //  const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.send({ message: 'No notes found for this user' });
        }
        res.send({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    }
});


// POST note
router.post('/', async (req, res) => {
    const { user_id, page, x, y, color, text } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Add to syncitems table first
        const syncQuery = 'INSERT INTO syncitem (publication_reader) VALUES ($1) RETURNING *';
        const syncValues = [user_id];
        const syncResult = await client.query(syncQuery, syncValues);
        const sync_id = syncResult.rows[0].id;

        // Then add to notes table
        const noteQuery = 'INSERT INTO note (id, page, x, y, color, text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const noteValues = [user_id, page, x, y, color, text];
        const noteResult = await client.query(noteQuery, noteValues);

        await client.query('COMMIT');

        res.send({ data: noteResult.rows[0], sync_id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// DELETE note
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Delete the note from the notes table by using id 
        const noteQuery = 'DELETE FROM note WHERE id = $1 RETURNING *';
        const noteValues = [id];
        const noteResult = await client.query(noteQuery, noteValues);

        if (noteResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Note not found' });
        }


        await client.query('COMMIT');

        res.json({ message: 'Note deleted', id: noteResult.rows[0].id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
