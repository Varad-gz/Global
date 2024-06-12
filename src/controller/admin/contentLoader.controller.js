// Admin Content Loader

// Global Variables
let authLocal;

// Middlewares
const { checkAuth } = require('../../utils/authContent');

// Models
const categoryModel = require('../../models/category.model');

module.exports = {

    //Category Creation Page
    getManageCategoryPage: async (req, res) => {
        const categories = await categoryModel.getAllCategoryNames();
        let locals = {
            title: 'Category Management Menu',
            categories: categories,
            scripts: ['/scripts/manageCategory.js', '/scripts/commonFunctions.js']
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/admin/adminDashboard/manageCategory', locals);
    },


    //Login Page
    getLoginPage: (req, res) => {
        let locals = {
            title: 'Admin Login',
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/admin/adminLogin', locals);
    },


    //Admin Creation Page
    getAdminCreationPage: (req, res) => {
        let locals = {
            title: 'Admin Creation',
            scripts: ['/scripts/passwordValidation.js'],
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/admin/adminDashboard/adminCreation', locals);
    },


    //Dashboard Page
    getDashboardPage: (req, res) => {
        let locals = {
            title: 'Admin Dashboard',
            nogoback: true
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/admin/adminDashboard', locals);
    },
}