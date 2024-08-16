const express = require("express")
const {fetchPublications,fetchSinglePublications,deletePublication, fetchResources} = require("../controller/publicationController")
const auth = require('../middleware/auth');
const router = express.Router();
// download in system
router.route('/').get( auth ,fetchPublications);
router.route('/:id').get(auth,fetchSinglePublications),delete(auth , deletePublication);
router.route( '/resources/:id' ).get( auth , fetchResources );



module.exports = router;