const express = require('express');
const router = express.Router();

const contentLoader = require('../controller/admin/contentLoader.controller');
const { isAdminAuthenticated } = require('../middleware/authentication.middleware');

router.get('/login', contentLoader.getLoginPage);

router.use(isAdminAuthenticated);
router.get('/dashboard', contentLoader.getDashboardPage);
router.get('/dashboard/manage/category', contentLoader.getManageCategoryPage);
router.get('/dashboard/admin-creation', contentLoader.getAdminCreationPage);


module.exports = router;