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

  const auth_token = req.authToken;
  const username = req.username;

  try {
    const result = await pool.query(
      `
            SELECT p.*
            FROM publicationreader pr
            JOIN publication p ON pr.publication_id = p.url_id
            WHERE pr.username = $1;
            `,
      [username]
    );

    if (result.rowCount > 0) {
      return res.send({ status: true, result: result.rows });
    }

    const response = await fetch(
      "https://www.osbornebooks.co.uk/api/publications",
      {
        method: "get",
        headers: {
          Authorization: `token ${auth_token}`,
        },
      }
    )
      // const response = await axios({
      //     methord:'get',
      //     URL:'/publications',  // Endpoint URL (baseURL is already set)
      // })
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
        return res.send({ message: "something went wrong" });
      });
    // res.status(200).json(response.data);

    await client.query("BEGIN");
    if (response.results.length > 0) {
      const publicationValues = response.results.map((pub) => [
        pub.urlId,
        pub.title,
        pub.description,
        pub.cover,
        pub.urlPath,
        new Date(pub.created_at * 1000).toISOString(),
        new Date(pub.updated_at * 1000).toISOString(),
        pub.metadata,
      ]);

      // Upsert publications: Insert new ones or do nothing if they exist
      const insertPublicationsQuery = `
                INSERT INTO publication (url_id, title, description, cover_url, path_url, created_at, updated_at, metadata)
                VALUES
                ${publicationValues
                  .map(
                    (_, i) =>
                      `($${i * 8 + 1}, $${i * 8 + 2}, $${i * 8 + 3}, $${
                        i * 8 + 4
                      }, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${
                        i * 8 + 8
                      })`
                  )
                  .join(", ")} 
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
      console.log("comp");
      // Prepare data for the publicationreader table
      const publicationReaderValues = response.results.map((pub) => [
        username,
        pub.urlId,
      ]);

      // Upsert into publicationreader table
      const insertPublicationReaderQuery = `
                INSERT INTO publicationreader (username, publication_id)
                VALUES
                ${publicationReaderValues
                  .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
                  .join(", ")}
                ON CONFLICT (username, publication_id) DO NOTHING
              `;
          
              const flatPublicationReaderValues = publicationReaderValues.flat();
              await client.query(
                insertPublicationReaderQuery, 
                flatPublicationReaderValues
            );    
          
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
const fetchSinglePublications =async (req,res)=>{
    const { id: publicationId } = req.params;
    const auth_token = req.authToken;
   const username = req.username;

    try {
      // check if book is present in table
      const bookCheckResult = await pool.query(
        `SELECT url_id FROM publication WHERE  url_id = $1`,
        [publicationId]
      );
      if (bookCheckResult.rows.length === 0) {
        console.log("book not found");
        console.log("fetching from Osbone server...");

        const osboneResponse= await fetch (`https://osbone-server.com/api/publications/${publicationId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `token ${auth_token}`
            },
          })
          
          if (!osboneResponse.ok) {
            console.error('Error fetching from Osbone server:', osboneResponse.statusText);
            return res.status(404).json({ error: "Book not found on Osbone server" });
          }

          const osboneData = await osboneResponse.json();
          // const osbonePublication = osboneData.results[0];
          const insertResult = await pool.query(
            `INSERT INTO publication(url_id ,title , descrption , cover_url , path_url , created_at , updated_at , metadata)
            VALUES ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7), $8)
            RETURNING url_id, title, description,
              cover_url AS "coverUrl",
              path_url AS "pathUrl",
              EXTRACT(EPOCH FROM created_at) AS created_at, 
              EXTRACT(EPOCH FROM updated_at) AS updated_at, 
              metadata`,
            [
              osboneData.url_id,
               osboneData.title,
               osboneData.description,
               osboneData.coverUrl,
               osboneData.urlPath,
               osboneData.created_at,
               osboneData.updated_at,
               osboneData.metadata
            ]
          );

          const publication = insertResult.rows[0];

          // Insert data into publicationreader table
          await pool.query(
            `INSERT INTO publicationreader (username, publication_id, updated_at)
             VALUES ($1, $2, to_timestamp($3))`,
             [ username , publication.url_id , Date.now() / 1000]
          );


        return res.status(200).json({"mes" : "success"});
      }
        // Query the database for publication details by ID
      const result = await pool.query(
            `SELECT url_id, title, description,
                    EXTRACT(EPOCH FROM created_at) AS created_at, 
                    EXTRACT(EPOCH FROM updated_at) AS updated_at, 
                    cover_url AS "coverUrl", 
                    path_url AS "pathUrl", 
                    metadata,
             FROM publication
             WHERE id = $1`,
      [publicationId]
    );

    // Check if publication exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Publication not found" });
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
        const query = "SELECT * FROM Publication WHERE id = $1";
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





