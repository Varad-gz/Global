
module.exports = {

    // ! Unauthorized
    getUnauthorizedPage: (req, res) => {
        let locals = {
            title: '401 Unauthorized',
            nogoback: true,
        }
        res.render('content/error/unauthorized', locals);
    },

}