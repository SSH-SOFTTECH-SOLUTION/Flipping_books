const { query } = require("express");
const axios = require("../config/axiosConfig")
const pool = require('../config/db')

const axiosInstance = require('../config/axiosConfig');
// const pool = require('../config/dbConfig'); // Assuming you have a dbConfig file for database connection

// todo => name changes
const fetchPublications = async (req, res) => {
    try {
        const response = await axiosInstance.get('/publications'); // Use axiosInstance
        const result = response.data;

        // Save data in database
        const queryText = `
            INSERT INTO publications (id, title, description, created_at, updated_at, cover_url, publication_url, publication_store_url)
            VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5), $6, $7, $8)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                created_at = EXCLUDED.created_at,
                updated_at = EXCLUDED.updated_at,
                cover_url = EXCLUDED.cover_url,
                publication_url = EXCLUDED.publication_url,
                publication_store_url = EXCLUDED.publication_store_url
        `;

        const values = result.map(publication => [
            publication.id,
            publication.title,
            publication.description,
            publication.created_at,
            publication.updated_at,
            publication.cover_url,
            publication.publication_url,
            publication.publication_store_url
        ]).flat();

        await pool.query(queryText, values);

        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching publications:', err);
        res.status(500).json({ msg: 'Failed to fetch data', error: err });
    }
};
const fetchSinglePublications =async (req,res)=>{
    const { id: publicationId } = req.params;
    
    try {
        // Query the database for publication details by ID
        const result = await pool.query(
            `SELECT id, title, description, 
                    EXTRACT(EPOCH FROM created_at) AS created_at, 
                    EXTRACT(EPOCH FROM updated_at) AS updated_at, 
                    cover_url AS "coverUrl", 
                    publication_url AS "publicationUrl", 
                    publication_store_url AS "publicationStoreUrl"
             FROM publications 
             WHERE id = $1`,
            [publicationId]
        );

        // Check if publication exists
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }

        // Send the publication details as the response
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching publication details:', error);
        res.status(500).json({ error: 'Failed to fetch publication details' });
    }
}


const deletePublication = async(req,res)=>{
    const { id: publicationId } = req.params;
    // if id dont exists in server
    if( !publicationId ) return res.status(400).json({msg:'publication id required'});
    try{
        const checkResult = await pool.query(
            `SELECT 1 FROM publications WHERE id = $1`,
            [publicationId]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ msg: 'Publication not found' });
        }
        const result = await pool.query(
            `DELETE FROM publications WHERE id = $1`,
            [publicationId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Publication not found' });
        }
        res.status(200).json({msg:'success'});
        

    }catch(err){
        console.log(err);
        res.status(500).json({msg:'failed to delete publication'});
    }

    
}


module.exports = {
    fetchPublications,
    fetchSinglePublications,
    deletePublication
}
