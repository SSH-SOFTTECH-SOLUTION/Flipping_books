
const express = require('express');
const pool = require('../config/db');
const router = express.Router();
console.log("hi ");
// GET bookmark
router.get('/', async (req, res) => {
    const { user_id } = req.body;
    try {
        const query = 'SELECT * FROM bookmark WHERE id = $1';
        const values = [user_id];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.send({ message: 'User not found' });
        }
        res.send({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    }
});

// POST bookmark
router.post('/', async (req, res) => {
    const { user_id, page } = req.body;
    // console.log('bookmark post req');   
    // req.setEncoding({m:"m"})
    const client = await pool.connect();
    try {

        await client.query('BEGIN')
        // Add to syncitems table first
        const syncQuery = 'INSERT INTO syncitem (publication_reader) VALUES ($1) RETURNING *';
        const syncValues = [user_id];
        const syncResult = await pool.query(syncQuery, syncValues);
        const sync_id = syncResult.rows[0].publication_reader;

        // Then add to bookmark table
        // const query = 'INSERT INTO bookmark (id,user_id, page, sync_id) VALUES ($1, $2, $3,$4) RETURNING *';
        const query = 'INSERT INTO bookmark (id,page) VALUES ($1, $2) RETURNING *';
        const values = [sync_id,page];
        const result = await pool.query(query, values);

        await client.query('COMMIT');
        res.send({ data: result.rows[0], sync_id });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    }
    finally{
        client.release();
    }
});

// DELETE bookmark
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
console.log(id);
    try {
        const query = 'DELETE FROM bookmark WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        res.json({ message: 'Bookmark deleted', id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

