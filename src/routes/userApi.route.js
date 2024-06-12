const express = require('express');
const router = express.Router();

// Controllers
const userActivities = require('../controller/user/userActivites.controller');

// Middlewares
const { securePassword } = require('../middleware/hashing.middleware');
const { isUserAuthenticated } = require('../middleware/authentication.middleware');

// For unrestricted routes

// # User Authentication
router.post('/authenticate', userActivities.authenticateUser);

// # User Registration
router.post('/register', securePassword, userActivities.registerUser);


// Checks for session object
router.use(isUserAuthenticated);

// For restricted routes

// -- User Profile
// # Edit Personal Details
router.post('/profile/edit/perdet', userActivities.editPersonalDetails);
// # Edit Email
router.post('/profile/edit/email', userActivities.editEmail);
// # Edit Password
router.post('/profile/edit/passwd', userActivities.editPassword);
// # Profile Picture
router.post('/profile/edit/image', userActivities.updateProfileImage);

// # User Authentication
router.get('/logout', userActivities.logoutUser);

// -- Manage Topics 
// # Topic Creation
router.post('/topic/create', userActivities.createTopic);
// # Fetch Topic Data
router.get('/fetch/topic/information', userActivities.getTopicInformation);
// # Edit Topic
router.post('/manage/topic/edit', userActivities.postTopicEditChanges);
// # Edit Topic Image
router.post('/manage/topic/edit/image', userActivities.updateTopicImage);
// # Delete Topic 
router.delete('/delete/topic/:id', userActivities.deleteTopic);

// -- Manage Threads
// # Thread Creation
router.post('/create/thread', userActivities.createNewThread);
// # Like Thread
router.post('/like/thread', userActivities.likeThreadController);
// # Dislike Thread
router.post('/dislike/thread', userActivities.dislikeThreadController);
// # Delete Thread
router.delete('/delete/thread/:id', userActivities.deleteThreadController);

// -- Manage Comments
// # Comment Creation
router.post('/create/comment', userActivities.createNewComment);
// # Like Comment
router.post('/like/comment', userActivities.likeCommentController);
// # Dislike Comment
router.post('/dislike/comment', userActivities.dislikeCommentController);
// # Delete Comment
router.delete('/delete/comment/:id', userActivities.deleteCommentController);

// -- Manage Replies
// # Comment Reply Creation
router.post('/create/commentreply', userActivities.createNewReply);
// # Like Reply
router.post('/like/reply', userActivities.likeReplyController);
// # Dislike Reply
router.post('/dislike/reply', userActivities.dislikeReplyController);
// # Delete Reply
router.delete('/delete/reply/:id', userActivities.deleteReplyController);

module.exports = router;