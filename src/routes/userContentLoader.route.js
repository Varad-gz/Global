const express = require('express');
const router = express.Router();

// Controllers
const contentLoader = require('../controller/user/contentLoader.controller');

// Middlewares
const { isUserAuthenticated } = require('../middleware/authentication.middleware');

router.get('/', contentLoader.getHomePage);
router.get('/login', contentLoader.getLoginPage);
router.get('/search', contentLoader.getSearchPage);
router.get('/register', contentLoader.getRegisterPage);
router.get('/c/:url', contentLoader.getCategoryPage);
router.get('/t/:topic', contentLoader.getTopicPage);
router.get('/t/:topic/th/:threadId/:threadUrl', contentLoader.getThreadPage);
router.get('/user/:username', contentLoader.getUserPage);

router.get('/manage/profile', isUserAuthenticated, contentLoader.getProfilePage);
router.get('/manage/topic', isUserAuthenticated, contentLoader.getManageTopicPage);
router.get('/manage/topic/create', isUserAuthenticated, contentLoader.getCreateTopicPage);


module.exports = router;