const util = require('util');
const bcrypt = require('bcrypt');

module.exports = {
    aHash: util.promisify(bcrypt.hash),
    cHash: util.promisify(bcrypt.compare),
}