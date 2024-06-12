const express = require('express');
const router = express.Router();

// Routes
const userContentLoaderRoutes = require('./userContentLoader.route');
const adminContentLoaderRoutes = require('./adminContentLoader.route');
const adminApiRoutes = require('./adminApi.route');
const userApiRoutes = require('./userApi.route');
const publicApiRoute = require('./publicApi.route');

// Middleware
const { routeRestrictions } = require('../middleware/authentication.middleware');

// Controllers
const { uploadImage } = require('../controller/multers.controller');
const errorController = require('../controller/errorContentLoader.controller');

router.use(routeRestrictions);
router.use(userContentLoaderRoutes);
router.use('/admin', adminContentLoaderRoutes);
router.use('/api/admin', adminApiRoutes);
router.use('/api/user', userApiRoutes);

router.use('/api/public', publicApiRoute);
router.get('/error/unauthorized', errorController.getUnauthorizedPage)
router.post('/api/upload/image/:folderName', uploadImage);

module.exports = router;