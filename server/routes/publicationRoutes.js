const express = require("express")
const {fetchPublications,fetchSinglePublications} = require("../controller/publicationController")
const router = express.Router();
// download in system
router.route('/').get(fetchPublications);
router.route('/:id').get(fetchSinglePublications);


module.exports = router;