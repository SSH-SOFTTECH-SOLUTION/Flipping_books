// mark.js
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// GET marks by user_id
router.get('/', async (req, res) => {
    const { user_id } = req.body;

    try {
        const query = 'SELECT * FROM mark WHERE id = $1';
        const values = [user_id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'No marks found for this user' });
        }

        res.send({ data: result.rows });
    } catch (err) {
        console.error('Error fetching marks:', err);
        res.status(500).send({ error: 'Server error' });
    }
});

// POST mark
router.post('/', async (req, res) => {
    console.log('Mark API POST request received');
    const { user_id, page, x, y } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into syncitems table first
      
        const syncQuery = 'INSERT INTO syncitem (publication_reader) VALUES ($1) RETURNING *';
        const syncValues = [user_id];
                    const syncResult = await client.query(syncQuery, syncValues);
        const sync_id = syncResult.rows[0].id;

        // Insert into mark table
        const markQuery = 'INSERT INTO mark (id, page, x, y) VALUES ($1, $2, $3, $4) RETURNING *';
                     const markValues = [user_id, page, x, y];
        const markResult = await client.query(markQuery, markValues);

        await client.query('COMMIT');
        res.send({ data: markResult.rows[0], sync_id });
             } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating mark:', err);
        res.status(500).send({ error: 'Server error' });
    } finally {
        client.release();
    }
});

// DELETE mark
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM mark WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mark not found' });
        }

        res.json({ message: 'Mark deleted', id: result.rows[0].id });
    } catch (err) {
        console.error('Error deleting mark:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
