const express = require('express');
const router = express.Router();

// Controllers
const adminActivities = require('../controller/admin/adminActivities.controller');
const userActivities = require('../controller/user/userActivites.controller');

// Middlewares
const { securePassword } = require('../middleware/hashing.middleware');
const { isAdminAuthenticated } = require('../middleware/authentication.middleware');

// For restricted routes

// # Admin Authentication
router.post('/authenticate', adminActivities.authenticateAdmin);

// Checks for session object
router.use(isAdminAuthenticated);

// For unrestricted routes

// # Manage Category
router.get('/fetch/category/information', adminActivities.getCategoryInformation);
router.post('/manage/category/create-new', adminActivities.createNewCategory);
router.post('/manage/category/edit', adminActivities.postEditChanges);
router.delete('/delete/category/:id', adminActivities.deleteCategory);

// # Admin Creation
router.post('/create', securePassword, adminActivities.registerUser);

// # Admin Authentication
router.get('/logout', adminActivities.logoutAdmin);


module.exports = router;