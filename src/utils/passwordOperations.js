const { aHash, cHash } = require('./promisified');
const saltRounds = 10;

module.exports = {
    //returns a hashed password
    hashPassword: async (plainText) => {
        try {
            const hash = await aHash(plainText, saltRounds);
            return hash;
        } catch (err) {
            console.log(err);
        }
    },

    //returns is password is hashed
    comparePassword: async (plainText, hash) => {
        try {
            const isMatch = await cHash(plainText, hash);
            return isMatch;
        } catch (err) {
            console.log(err)
        }
    }
}