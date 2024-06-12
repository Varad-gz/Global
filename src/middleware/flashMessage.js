module.exports = {
    flashThis: (req, res, next) => {
        const alert = req.flash('alert');
        const alertWithButton = req.flash('alertWithButton');
        const logout = req.flash('logout');

        if (alert.length > 0) {
            res.locals.alert = alert;
        } else if (alertWithButton.length > 0) {
            res.locals.alertWithButton = alertWithButton;
        } else if (logout.length > 0) {
            res.locals.logout = logout;
        }

        next();
    }
}