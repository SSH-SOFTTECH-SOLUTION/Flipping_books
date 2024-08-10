const axios = require("../config/axiosConfig")
const pool = require('../config/db')

const fetchPublications = async (req,res)=>{
    try{
        const response = await axios({
            methord:'get',
            URL:'/publications',  // Endpoint URL (baseURL is already set)
        })
        res.status(200).json(response.data);
    }catch(err){
        res.status(500).json({msg:'failed to fetch data'});
    }
}
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


module.exports = {
    fetchPublications,
    fetchSinglePublications
}