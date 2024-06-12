// Utils
const { comparePassword } = require('../../utils/passwordOperations');

// Models
const categoryModel = require('../../models/category.model');
const adminModel = require('../../models/admin.model');

module.exports = {

    // Admin

    // -- Admin Dashboard

    // ---- Manage Category
    // Get Requests
    // ! Get Category Information Controller
    getCategoryInformation: async (req, res) => {
        const id = parseInt(req.query.id);
        res.json(await categoryModel.getCategoryById(id));
    },
    // Post Requests
    // ! Category Create Controller
    createNewCategory: async (req, res) => {
        try {
            const { categoryName, categoryDesc, categoryURL } = req.body;
            await categoryModel.createCategory(categoryName, categoryDesc, categoryURL);
            res.redirect('back');
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },
    // Put Requests
    // ! Edit Category Controller
    postEditChanges: async (req, res) => {
        try {
            const { categoryName, categoryDesc, id, categoryURL } = req.body;
            await categoryModel.editCategory(parseInt(id), categoryName, categoryDesc, categoryURL);
            req.flash('alert', 'Changes successfully processed')
            res.redirect('back');
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },
    // Delete Requests
    // ! Category Delete Controller
    deleteCategory: async (req, res) => {
        const id = parseInt(req.params.id);
        const result = await categoryModel.deleteCategoryById(id);
        res.json({ id: result.id });
    },


    // ---- Admin Creation
    // Post Requests
    // ! Register Admin Controller
    registerUser: async (req, res) => {
        try {
            const { fname, lname, email, hash } = req.body;
            await adminModel.createAdmin(fname, lname, email, hash);
            req.flash('alert', 'Admin Registered Successfully');
            res.redirect('back');
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },

    // -- Admin Authentication
    // Post Requests
    // ! Authenticate Controller
    authenticateAdmin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const adminData = await adminModel.fetchAdminData(email);
            if (adminData != null) {
                if (await comparePassword(password, adminData.password)) {
                    req.session.authenticated = {
                        fname: adminData.fname,
                        lname: adminData.lname,
                        userid: adminData.id,
                        role: 'admin'
                    }
                    req.flash('alert', 'Login Successful');
                    res.redirect('/admin/dashboard');
                } else {
                    req.flash('alertWithButton', 'Incorrect password!');
                    res.redirect('/admin/login');
                }
            } else {
                req.flash('alertWithButton', 'User not found!');
                res.redirect('/admin/login');
            }
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },
    // ! Logout Controller
    logoutAdmin: (req, res) => {
        delete req.session.authenticated;
        req.flash('alert', 'Logged out successfully')
        res.redirect('/admin/login');
    }

}