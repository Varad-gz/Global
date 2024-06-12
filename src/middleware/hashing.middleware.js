const { hashPassword, comparePassword } = require('../utils/passwordOperations');

module.exports = {
    //hashing password middleware
    securePassword: async (req, res, next) => {
        try {
            req.body.hash = await hashPassword(req.body.password);
            delete req.body.password;
            next();
        } catch (err) {
            throw err;
        }
    },

    //check password hash middleware
    checkPassword: async (req, res, next) => {
        try {
            req.body.ismatch = await comparePassword(req.body.password, req.body.hash);
            next();
        } catch (err) {
            throw err;
        }
    }
}