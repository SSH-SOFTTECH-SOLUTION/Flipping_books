const { query } = require("express");
const { response } = require("express");
const axios = require("../config/axiosConfig")
const pool = require('../config/db');
const auth = require("../middleware/auth");

const axiosInstance = require('../config/axiosConfig');
// const pool = require('../config/dbConfig'); // Assuming you have a dbConfig file for database connection

// todo => name changes
const fetchPublications = async (req,res)=>{
    const client = await pool.connect();

    const auth_token = req.authToken
    const username = req.username


    //TODO: check MAS db if publication exits



    try{
        const response = await fetch('https://www.osbornebooks.co.uk/api/publications', {
            method: 'get',
            headers: {
                Authorization: `token ${auth_token}`
            }
        })
        // const response = await axios({
        //     methord:'get',
        //     URL:'/publications',  // Endpoint URL (baseURL is already set)
        // })
        .then(response => response.json())
        .catch(err => {
            console.log(err);
            return res.send({message: 'something went wrong'})
        })
        // res.status(200).json(response.data);


        await client.query('BEGIN')
        if(response.results.length > 0){
            const publicationValues = response.results.map(pub => [
                pub.urlId,
                pub.title,
                pub.description,
                pub.cover,
                pub.urlPath,
                new Date(pub.created_at * 1000).toISOString(),  
                new Date(pub.updated_at * 1000).toISOString(), 
                pub.metadata
              ]);
          
              // Upsert publications: Insert new ones or do nothing if they exist
              const insertPublicationsQuery = `
                INSERT INTO publication (url_id, title, description, cover_url, path_url, created_at, updated_at, metadata)
                VALUES
                ${publicationValues.map((_, i) => `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8})`).join(', ')} 
                ON CONFLICT (url_id) DO UPDATE SET 
                    title = excluded.title,
                    description = excluded.description,
                    cover_url = excluded.cover_url,
                    path_url = excluded.path_url,
                    created_at = excluded.created_at,
                    updated_at = excluded.updated_at
              `;
          
              const flatPublicationValues = publicationValues.flat();
              await client.query(insertPublicationsQuery, flatPublicationValues);
          console.log('comp')
              // Prepare data for the publicationreader table
              const publicationReaderValues = response.results.map(pub => [
                username, pub.urlId
              ]);
          

              // Upsert into publicationreader table
              const insertPublicationReaderQuery = `
                INSERT INTO publicationreader (username, publication_id)
                VALUES
                ${publicationReaderValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
                ON CONFLICT (username, publication_id) DO NOTHING
              `;
          
              const flatPublicationReaderValues = publicationReaderValues.flat();
              await client.query(insertPublicationReaderQuery, flatPublicationReaderValues);    
          
              await client.query('COMMIT');
              console.log('Publications stored and reader mappings updated successfully.');
              return res.send(response.results)

        }
        else{
            res.send({message: 'no publications found'})
        }
    }catch(err){
        await client.query('ROLLBACK');
        console.log(err);
        res.status(500).json({msg:'failed to fetch data'});
    }
    finally{
        client.release();
    }
}

// const fetchPublications = async (req, res) => {
//     try {
//         const response = await axiosInstance.get('/publications'); // Use axiosInstance
//         const result = response.data;

//         // Save data in database
//         const queryText = `
//             INSERT INTO publications (id, title, description, created_at, updated_at, cover_url, publication_url, publication_store_url)
//             VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5), $6, $7, $8)
//             ON CONFLICT (id) DO UPDATE SET
//                 title = EXCLUDED.title,
//                 description = EXCLUDED.description,
//                 created_at = EXCLUDED.created_at,
//                 updated_at = EXCLUDED.updated_at,
//                 cover_url = EXCLUDED.cover_url,
//                 publication_url = EXCLUDED.publication_url,
//                 publication_store_url = EXCLUDED.publication_store_url
//         `;

//         const values = result.map(publication => [
//             publication.id,
//             publication.title,
//             publication.description,
//             publication.created_at,
//             publication.updated_at,
//             publication.cover_url,
//             publication.publication_url,
//             publication.publication_store_url
//         ]).flat();

//         await pool.query(queryText, values);

//         res.status(200).json(result);
//     } catch (err) {
//         console.error('Error fetching publications:', err);
//         res.status(500).json({ msg: 'Failed to fetch data', error: err });
//     }
// };
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

// on hault, firt do get resources 

const deletePublication = async(req,res)=>{
    const { id: publicationId } = req.params;
    const userId = req.username;
    // const auth =  
    // if id dont exists in server
    if( !publicationId ) {
        return res.status(400).json({msg:'publication id required'});
    }
    try{
        const checkResult = await pool.query(
            `SELECT 1 FROM publications WHERE id = $1`,
            [publicationId]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({ msg: 'Publication not found' });
        }

        const accessCheck = await pool.query(
            `SELECT 1 FROM publicationreader WHERE publication_id = $1 AND user_id = $2`,
            [publication_id, userId]
        );

        if (accessCheck.rowCount === 0) {
            return res.status(404).json({ msg: 'No access record found for this user and publication' });
        }

        const deleteResult = await pool.query(
            `DELETE FROM publicationreader WHERE publication_id = $1 AND user_id = $2`,
            [publication_id, userId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(500).json({ msg: 'Failed to delete access record' });
        }

        res.status(200).json({msg:'success'});
        

    }catch(err){
        console.log(err);
        res.status(500).json({msg:'failed to delete publication'});
    }

    
}

// fetch resoures 
const fetchResources = async (req, res)=>{
    const {id : publicationId} = req.params;
    const auth_token = req.authToken
    const username = req.username
    // const userId = req.username; // from auth middlewar e
    // const userId = 'testuser'; // from auth middleware  
    try{
        const query = "SELECT * FROM Publication WHERE url_id = $1";
        const result = await pool.query(query,[publicationId]);

        if(result.length === 0){
            res.status(404).json({msg:'publication not found'});
        }

        const publication = result.rows[0];

        // Original path_url
        let originalPathUrl = publication.path_url;

        // Convert the URL =>  /api/ebook/
        let modifiedPathUrl = originalPathUrl.replace('/ebook/', '/api/ebook/');

        res.status(200).json({ modifiedPathUrl , auth_token });

    }catch(err){
        console.log(err);
        res.status(500).json({msg:'failed to fetch resources'});
    }
}


module.exports = {
    fetchPublications,
    fetchSinglePublications,
    deletePublication,
    fetchResources
}





