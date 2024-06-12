const express = require('express');
const router = express.Router();

// Controllers
const userActivities = require('../controller/user/userActivites.controller');

router.get('/fetch/replies', userActivities.fetchAllRepliesWhereCommentId)

module.exports = router;