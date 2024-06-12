module.exports = {
    isAdminAuthenticated: (req, res, next) => {
        if (req.session.authenticated && req.session.authenticated.role === 'admin') {
            next();
        } else {
            res.redirect('/admin/login');
        }
    },

    isUserAuthenticated: (req, res, next) => {
        if (req.session.authenticated && req.session.authenticated.role === 'user') {
            next();
        } else {
            if (req.get('Origin')) {
                res.status(401).send('unauthorized');
            } else {
                res.redirect('/login');
            }
        }
    },

    routeRestrictions: (req, res, next) => {
        const sessionData = req.session.authenticated;
        if (sessionData) {
            if (sessionData.role === 'admin') {
                const url = req.originalUrl;
                if (url.startsWith('/admin/login')) {
                    req.flash('logout', '/api/admin/logout');
                    res.redirect('/admin/dashboard');
                } else {
                    const { fname, lname, role } = sessionData;
                    req.body.authenticated = {
                        username: `${fname} ${lname}`,
                        role: role
                    }
                    next();
                }
            } else if (sessionData.role === 'user') {
                const url = req.originalUrl;
                if (url.startsWith('/admin') || url.startsWith('/register') || url.startsWith('/login')) {
                    req.flash('logout', '/api/user/logout');
                    res.redirect('/');
                } else {
                    const { username, role, picture } = sessionData;
                    req.body.authenticated = {
                        username: username,
                        role: role,
                        picture: picture
                    }
                    next();
                }
            }
        } else {
            req.body.authenticated = {};
            next();
        }
    }
}