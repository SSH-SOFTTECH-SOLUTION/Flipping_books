
// routes/highlight.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET highlights by user_id
router.get('/', async (req, res) => {
    const { user_id } = req.body;

    try {
        const query = 'SELECT * FROM highlight WHERE id = $1';
        const values = [user_id];

       const result = await pool.query(query, values);   

       // if you want to geating all(gat all highlights at a time )
                // const query = 'SELECT * FROM highlight';
        // const result = await pool.query(query);
      
        

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'No highlights found for this user' });
        }

        res.send({ data: result.rows });
    } catch (err) {
        console.error('Error fetching highlights:', err);
        res.status(500).send({ error: 'Server error' });
    }
});


// POST highlight
router.post('/', async (req, res) => {
    const { user_id, page, start, end_position, text } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into syncitems table first
        const syncQuery = 'INSERT INTO syncitem (publication_reader) VALUES ($1) RETURNING *';
        const syncValues = [user_id];
        const syncResult = await client.query(syncQuery, syncValues);
        const sync_id = syncResult.rows[0].id;

        // Insert into highlight table
        const highlightQuery = 'INSERT INTO highlight (id, page, start, end_position, text) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const highlightValues = [user_id, page, start, end_position, text];
        const highlightResult = await client.query(highlightQuery, highlightValues);

        await client.query('COMMIT');
        res.send({ data: highlightResult.rows[0], sync_id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating highlight:', err);
        res.status(500).send({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// DELETE highlight
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM highlight WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Highlight not found' });
        }

        res.json({ message: 'Highlight deleted', id: result.rows[0].id });
    } catch (err) {
        console.error('Error deleting highlight:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

