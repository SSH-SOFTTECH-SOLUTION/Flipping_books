const express =  require('express')
const router = express.Router();
const {removeUserAuthToken,deleteUser,updateUserPublication} = require('../controller/webhookController')

router.route('/update_user')
    .post(removeUserAuthToken)
    .delete(deleteUser)

router.route('/update_user_publication')
    .post(updateUserPublication)
    // .delete(deleteUserPublication)

module.exports = router