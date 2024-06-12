module.exports = {

    // Content Loader Check
    checkAuth: (locals, auth) => {
        if (Object.keys(auth).length != 0) {
            locals.authenticatedUser = auth;
            return locals;
        } else {
            return null;
        }
    },
}