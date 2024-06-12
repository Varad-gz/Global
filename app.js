const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const ejsLayouts = require('express-ejs-layouts');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const { flashThis } = require('./src/middleware/flashMessage');


const routes = require('./src/routes/route');
const threadModel = require('./src/models/thread.model');
const userActivitesController = require('./src/controller/user/userActivites.controller');
const commentModel = require('./src/models/comment.model');
const replyModel = require('./src/models/reply.model');

const PORT = 3000;

app.use(cors({ credentials: true, origin: `http://localhost:${PORT}` }))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(cookieParser());

app.use(session({
    secret: 'globalforum',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(flashThis);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.use(routes);

app.listen(PORT || 3000, (err) => {
    if (err) throw err
    console.log(`The server is running.... http://localhost:${PORT}/`)
});

async function clearDeleted() {
    const replies = await replyModel.getIdWhereDeleted();
    if (replies.length > 0) {
        for (const reply of replies) {
            await userActivitesController.deleteReplyControllerStart(reply.id)
        }
    }
    setTimeout(() => { }, 3000);
    const comments = await commentModel.getIdWhereDeleted();
    if (comments.length > 0) {
        for (const comment of comments) {
            await userActivitesController.deleteCommentControllerStart(comment.id)
        }
    }
    setTimeout(() => { }, 3000);
    const threads = await threadModel.getIdWhereDeleted();
    if (threads.length > 0) {
        for (const thread of threads) {
            await userActivitesController.deleteThreadControllerStart(thread.id)
        }
    }
}

clearDeleted();
