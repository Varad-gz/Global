// User Content Loader

const path = require('path');

// Global Variables
let authLocal;

// Middlewares
const { checkAuth } = require('../../utils/authContent');

// Models
const categoryModel = require('../../models/category.model');
const userModel = require('../../models/user.model');
const topicModel = require('../../models/topic.model');
const threadModel = require('../../models/thread.model');
const threadLikedModel = require('../../models/threadLiked.model');
const threadDislikedModel = require('../../models/threadDisliked.model');
const commentModel = require('../../models/comment.model');
const commentDislikedModel = require('../../models/commentDisliked.model');
const commentLikedModel = require('../../models/commentLiked.model');
const replyModel = require('../../models/reply.model');

// Utils
const sharp = require('../../utils/sharp');
const dateParser = require('../../utils/dateParser');

module.exports = {

    //Home Page
    getHomePage: async (req, res) => {
        const categories = await categoryModel.getAllCategoriesWithTopics();
        const categoryNames = await categoryModel.getAllCategoryNamesAndURL();
        let locals = {
            title: 'Global - Forum Platform',
            nogoback: true,
            scripts: ['/scripts/categoriesBar.js'],
            categories: categories,
            categoryNames: categoryNames
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/home', locals);
    },


    // Search Page
    getSearchPage: async (req, res) => {
        const filter = req.query.filter;
        const search = req.query.searchq;
        let locals;
        if (filter === 'TH') {
            const threads = await threadModel.searchTitle(search);
            locals = {
                title: `Search Threads - ${search}`,
                searchHeading: `Search results for '${search}' in threads`,
                threads: threads
            }
        } else if (filter === 'CT') {
            const categories = await categoryModel.searchTitle(search);
            locals = {
                title: `Search Categories - ${search}`,
                searchHeading: `Search results for '${search}' in categories`,
                categories: categories
            }
        } else if (filter === 'TP') {
            const topics = await topicModel.searchTitle(search);
            locals = {
                title: `Search Topics - ${search}`,
                searchHeading: `Search results for '${search}' in topics`,
                topics: topics
            }
        }
        locals.backgroundColor = '#F3F4F6';
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/search', locals);
    },


    //Login Page
    getLoginPage: (req, res) => {
        let locals = {
            title: 'Login',
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if (typeof req.query.return != 'undefined') {
            locals.returnUrl = req.query.return;
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/login', locals);
    },


    //Register Page
    getRegisterPage: (req, res) => {
        let locals = {
            title: 'Register',
            scripts: ['/scripts/passwordValidation.js'],
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/register', locals);
    },


    //Category Page
    getCategoryPage: async (req, res) => {
        const url = req.params.url;
        const category = await categoryModel.getCategoryByURL(url);
        const topics = await topicModel.topicsWhereCategoryUrlWithCatName(url);
        console.log(category);
        let locals = {
            title: `Category - ${category.name}`,
            catName: category.name,
            catid: category.id,
            topics: topics
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/category', locals);
    },

    //Topic Page
    getTopicPage: async (req, res) => {
        const url = req.params.topic;
        const topic = await topicModel.topicWhereURLWithCreator(url);
        const threads = await threadModel.fetchThreadsWithAuthorUsernameWhereTopicID(topic.id);

        topic.createdAt = dateParser.dateParse(topic.createdAt);

        threads.forEach(async (thread) => {
            thread.createdAt = dateParser.dateParse(thread.createdAt);
        });


        let locals = {
            title: topic.name,
            scripts: ['/scripts/modalImage.js', '/scripts/topicPage.js'],
            topic: topic,
            threads: threads,
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        } else {
            locals.loginReturn = encodeURIComponent(req.originalUrl);
        }
        res.render('content/topic', locals);
    },

    //Thread Page
    getThreadPage: async (req, res) => {
        const id = req.params.threadId;
        const thread = await threadModel.fetchThreadDataWithAuthorUsernameWhereThreadID(parseInt(id));
        const comments = await commentModel.fetchCommentsWhereThreadID(parseInt(id));

        thread.createdAt = dateParser.dateParse(thread.createdAt);

        for (const comment of comments) {
            comment.createdAt = dateParser.dateParse(comment.createdAt);
            comment.replyCount = await replyModel.replyCountWhereCommentId(comment.id);
        }

        console.log(comments);

        comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (req.session.authenticated) {
            const userid = req.session.authenticated.userid;
            if ((await threadLikedModel.fetchCountWhereUserIdAndPostId(userid, thread.id))._count != 0) {
                thread.liked = true;
            } else if ((await threadDislikedModel.fetchCountWhereUserIdAndPostId(userid, thread.id))._count != 0) {
                thread.disliked = true;
            }
            for (const comment of comments) {
                if ((await commentLikedModel.fetchCountWhereUserIdAndCommentId(userid, comment.id))._count != 0) {
                    comment.liked = true;
                } else if ((await commentDislikedModel.fetchCountWhereUserIdAndCommentId(userid, comment.id))._count != 0) {
                    comment.disliked = true;
                }
            }
        }

        let imgh;
        if (typeof thread.content.image != 'undefined') {
            const filePath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', thread.content.image.path);
            imgh = await sharp.isPortrait(filePath);
        }

        let locals = {
            title: thread.title,
            thread: thread,
            comments: comments,
            backgroundColor: '#F3F4F6',
            imgh: imgh,
            scripts: ['/scripts/threadPage.js'],
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        } else {
            locals.loginReturn = encodeURIComponent(req.originalUrl);
        }
        res.render('content/thread', locals);
    },

    // Manage Profile Page
    getProfilePage: async (req, res) => {
        const { username, email } = req.session.authenticated;
        let userData = await userModel.fetchUserDataOR(username);
        if (userData === null) {
            userData = await userModel.fetchUserDataOR(email);
        }
        let locals = {
            title: 'Profile',
            scripts: ['/scripts/manageUserProfile.js', '/scripts/commonFunctions.js', '/scripts/passwordValidation.js', '/scripts/fileUpload.js'],
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)',
            userData: userData
        }
        if (userData.picture != null) {
            locals.scripts.push('/scripts/modalImage.js');
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/user/profile', locals);
    },

    //Topic Creation Page
    getCreateTopicPage: async (req, res) => {
        let locals;
        if (typeof req.query.inCategory === 'undefined' && typeof req.query.for === 'undefined') {
            const categories = await categoryModel.getAllCategoryNames();
            locals = {
                title: 'Create Topic',
                scripts: ['/scripts/fileUpload.js', '/scripts/createTopic.js'],
                backgroundColor: '#F9FAFB',
                categories: categories
            }
        } else {
            locals = {
                title: 'Create Topic',
                scripts: ['/scripts/fileUpload.js', '/scripts/createTopic.js'],
                backgroundColor: '#F9FAFB',
                category: { id: req.query.for, name: req.query.inCategory }
            }
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/user/createTopic', locals);
    },

    //Topic Creation Page
    getManageTopicPage: async (req, res) => {
        const id = req.session.authenticated.userid;
        const topics = await topicModel.fetchAllTopicNamesWhereCreatorID(parseInt(id));
        topics.forEach(async (topic) => {
            topic.count = await threadModel.fetchAllThreadsCountWithTopicId(topic.id);
        });
        let locals = {
            title: 'Manage Topics',
            scripts: ['/scripts/manageTopics.js', '/scripts/commonFunctions.js'],
            backgroundColor: '#F9FAFB',
            topics: topics
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/user/manageTopic', locals);
    },

    //User Page
    getUserPage: async (req, res) => {
        const username = req.params.username;

        let user = await userModel.fetchUserPicture(username);
        const threads = await threadModel.fetchAllThreadsWithTopicWhereCreatorUsername(username);

        threads.forEach(async (thread) => {
            thread.createdAt = dateParser.dateParse(thread.createdAt);
        });

        user.username = username;

        let locals = {
            title: `Profile - ${username}`,
            scripts: ['/scripts/modalImage.js'],
            user: user,
            threads: threads,
            backgroundImage: 'linear-gradient(to right, #8b5cf6, #D846EF)'
        }
        if ((authLocal = checkAuth(locals, req.body.authenticated)) != null) {
            locals = authLocal;
        };
        res.render('content/user/userProfile', locals);
    },

}