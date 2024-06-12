const path = require('path');
const fs = require('fs').promises;

// Utils
const { comparePassword, hashPassword } = require('../../utils/passwordOperations');
const dateParser = require('../../utils/dateParser');

// Models
const userModel = require('../../models/user.model');
const topicModel = require('../../models/topic.model');
const categoryModel = require('../../models/category.model');
const threadModel = require('../../models/thread.model');
const threadLikedModel = require('../../models/threadLiked.model');
const threadDislikedModel = require('../../models/threadDisliked.model');
const commentModel = require('../../models/comment.model');
const commentLikedModel = require('../../models/commentLiked.model');
const commentDislikedModel = require('../../models/commentDisliked.model');
const replyModel = require('../../models/reply.model');
const replyLikedModel = require('../../models/replyLiked.model');
const replyDislikedModel = require('../../models/replyDisliked.model');

module.exports = {

    // -- Register User
    // ! Register User Controller
    registerUser: async (req, res) => {
        try {
            const { fname, lname, email, username, hash } = req.body;
            await userModel.createUser(fname, lname, username, email, hash);
            req.flash('alert', 'User Registered Successfully');
            res.redirect('/login');
        } catch (error) {
            console.log(error);
            if (error.meta.target[0] === 'email') {
                req.flash('alertWithButton', 'Email already exists!');
                res.redirect('back');
            } else if (error.meta.target[0] === 'username') {
                req.flash('alertWithButton', 'Username already exists!');
                res.redirect('back');
            } else {
                req.flash('alertWithButton', 'Process failed!');
                res.redirect('back');
            }
        }
    },

    // -- Admin Authentication
    // Post Requests
    // ! Authenticate Controller
    authenticateUser: async (req, res) => {
        try {
            const { username, password } = req.body;
            const userData = await userModel.fetchUserDataOR(username);
            if (userData != null) {
                if (await comparePassword(password, userData.password)) {
                    req.session.authenticated = {
                        username: userData.username,
                        userid: userData.id,
                        picture: userData.picture,
                        email: userData.email,
                        role: 'user'
                    }
                    req.flash('alert', 'Login Successful');
                    if (typeof req.body.return != 'undefined') {
                        res.redirect(req.body.return)
                    } else {
                        res.redirect('/');
                    }
                } else {
                    req.flash('alertWithButton', 'Incorrect password!');
                    res.redirect('/login');
                }
            } else {
                req.flash('alertWithButton', 'User not found!');
                res.redirect('/login');
            }
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },
    // ! Logout Controller
    logoutUser: (req, res) => {
        delete req.session.authenticated;
        req.flash('alert', 'Logged out successfully')
        res.redirect('/login');
    },


    // -- User Profile
    // ! Personal Details
    editPersonalDetails: async (req, res) => {
        try {
            const { id, fname, lname, username } = req.body;
            await userModel.updatePersonalDetails(parseInt(id), fname, lname, username);
            req.flash('alert', 'Updated successfully');
            res.redirect('/manage/profile');
        } catch (error) {
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },
    // ! Email Change
    editEmail: async (req, res) => {
        try {
            const { id, nemail, cpassword } = req.body;
            const userData = await userModel.fetchUserDataID(parseInt(id));
            if (await comparePassword(cpassword, userData.password)) {
                await userModel.updateEmail(parseInt(id), nemail);
                req.flash('alert', 'Email updated successfully');
                res.redirect('/manage/profile');
            } else {
                req.flash('alertWithButton', 'Incorrect password!');
                res.redirect('back');
            }
        } catch (error) {
            if (error.meta.target[0] === 'email') {
                req.flash('alertWithButton', 'Email already exists!');
                res.redirect('back');
            } else {
                req.flash('alertWithButton', 'Process failed!');
                res.redirect('back');
            }
        }
    },
    // ! Personal Details
    editPassword: async (req, res) => {
        try {
            const { id, opassword, password } = req.body;
            const userData = await userModel.fetchUserDataID(parseInt(id));
            if (await comparePassword(opassword, userData.password)) {
                await userModel.updatePassword(parseInt(id), await hashPassword(password));
                delete req.session.authenticated;
                req.flash('alert', 'Password updated successfully');
                res.redirect('/login');
            } else {
                req.flash('alertWithButton', 'Old password incorrect!');
                res.redirect('back');
            }
        } catch (error) {
            console.log(error);
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },
    // ! Profile Picture
    updateProfileImage: async (req, res) => {
        try {
            const { id, file, folderName, imagePath } = req.body;
            if (imagePath != '') {
                const filePath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', imagePath);
                await fs.unlink(filePath);
            }
            const filePath = path.join('/', 'images', 'uploads', folderName, file);
            await userModel.updateImage(parseInt(id), filePath);
            req.session.authenticated.picture = filePath;
            req.flash('alert', 'Picture Updated');
            res.redirect(`/manage/profile`);
        } catch (error) {
            console.log(error);
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },


    // -- Topic
    // ! Topic Creation
    createTopic: async (req, res) => {
        try {
            const creatorid = req.session.authenticated.userid;
            const { category, name, desc, file, url, folderName } = req.body;
            const filePath = path.join('/', 'images', 'uploads', folderName, file);
            await topicModel.createTopic(name, desc, filePath, parseInt(category), parseInt(creatorid), url);
            req.flash('alert', 'Topic created successfully');
            res.redirect(`/t/${url}`);
        } catch (error) {
            console.log(error)
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },
    // ! Get Topic Information Controller
    getTopicInformation: async (req, res) => {
        const id = parseInt(req.query.id);
        const topic = await topicModel.fetchTopicDataWhereID(id);
        const categories = await categoryModel.getAllCategoryNames();
        const data = {
            topic: topic,
            categories: categories
        }
        res.json(data);
    },
    // ! Edit Topic Controller
    postTopicEditChanges: async (req, res) => {
        try {
            const { topicName, topicDesc, id, topicURL, category } = req.body;
            await topicModel.updateTopic(parseInt(id), topicName, topicDesc, topicURL, parseInt(category));
            req.flash('alert', 'Changes successfully processed')
            res.redirect('back');
        } catch (error) {
            req.flash('alertWithButton', 'Process failed');
            res.redirect('back');
        }
    },
    // ! Topic Delete Controller
    deleteTopic: async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const threadCountResult = await threadModel.fetchAllThreadsCountWithTopicId(id);
            if (threadCountResult._count != 0) {
                throw new Error('TopicHasThreads');
            } else {
                const image = await topicModel.fetchTopicImageWhereID(parseInt(id));
                const filePath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', image.image);
                await fs.unlink(filePath);
                const result = await topicModel.deleteTopicById(parseInt(id));
                res.json({ id: result.id });
            }
        } catch (error) {
            if (error.message === 'TopicHasThreads') {
                res.status(400).json({ error: 'Topic has threads!' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },
    // ! Topic Picture
    updateTopicImage: async (req, res) => {
        try {
            const { id, file, folderName, imagePath } = req.body;
            if (imagePath != '') {
                try {
                    const filePath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', imagePath);
                    await fs.unlink(filePath);
                } catch (error) {
                    if (!error.code === 'ENOENT') {
                        throw error;
                    }
                }
            }
            const filePath = path.join('/', 'images', 'uploads', folderName, file);
            await topicModel.updateImage(parseInt(id), filePath);
            req.flash('alert', 'Image Updated');
            res.redirect(`/manage/topic`);
        } catch (error) {
            console.log(error);
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },

    // -- Thread
    // ! Thread Creation
    createNewThread: async (req, res) => {
        try {
            const creatorid = req.session.authenticated.userid;
            const body = req.body;
            let filePath = '';

            let content = {
                text: body.threadContent
            }

            if (typeof body.file != 'undefined') {
                filePath = path.join('/', 'images', 'uploads', body.folderName, body.file);
                content.image = {
                    path: filePath,
                    bg: body.bg
                }
            }

            let url = body.title.toLowerCase();
            url = url.replace(/\s+/g, ' ').trim();
            url = url.replace(/\s/g, '-');

            const { id } = await threadModel.createThread(body.title, content, url, parseInt(body.topicId), parseInt(creatorid))

            req.flash('alert', 'Thread created successfully');
            res.redirect(`/t/${body.topicId}/th/${id}/${url}`);
        } catch (error) {
            req.flash('alertWithButton', 'Process failed!');
            res.redirect('back');
        }
    },

    // Like/Dislikes
    // ! Like Thread
    likeThreadController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const threadLiked = await threadLikedModel.fetchID(userid, id);
            if (threadLiked === null) {
                try {
                    const threadDislikedId = await threadDislikedModel.fetchID(userid, id);
                    if (threadDislikedId === null) {
                        await threadLikedModel.likeThreadAndIncrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await threadLikedModel.removeDislikedThreadAndLikeThreadAndIncrementScore(userid, id, threadDislikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await threadLikedModel.removeLikeThreadAndDecrementScore(id, threadLiked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Dislike Thread
    dislikeThreadController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const threadDisliked = await threadDislikedModel.fetchID(userid, id);
            if (threadDisliked === null) {
                try {
                    const threadLikedId = await threadLikedModel.fetchID(userid, id);
                    if (threadLikedId === null) {
                        await threadDislikedModel.dislikeThreadAndDecrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await threadDislikedModel.removeLikedThreadAndDislikeThreadAndDecrementScore(userid, id, threadLikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await threadDislikedModel.removeDislikeThreadAndIncrementScore(id, threadDisliked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Delete Thread
    deleteThreadController: async (req, res) => {
        try {
            const id = req.params.id;
            if (await commentModel.commentCountWhereThreadId(id) > 0 || await threadLikedModel.fetchCountWherePostId(id) > 0 || await threadDislikedModel.fetchCountWherePostId(id) > 0) {
                try {
                    await threadModel.softDeleteThread(id);
                    res.json({ message: 0 })
                } catch (error) {
                    res.json({ message: 2 })
                }
            } else {
                try {
                    await threadModel.hardDeleteThread(id);
                    res.json({ message: 1 })
                } catch (error) {
                    console.log(error);
                    res.json({ message: 2 })
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
    // ! Delete Thread Start
    deleteThreadControllerStart: async (id) => {
        try {
            if (await commentModel.commentCountWhereThreadId(id) > 0 || await threadLikedModel.fetchCountWherePostId(id) > 0 || await threadDislikedModel.fetchCountWherePostId(id) > 0) {
                try {
                    console.log(0);
                } catch (error) {
                    console.log(2);
                }
            } else {
                try {
                    await threadModel.hardDeleteThread(id);
                    console.log(1);
                } catch (error) {
                    console.log(2);
                }
            }
        } catch (error) {
            console.log('Internal Server Error')
        }
    },


    // -- Comment
    // ! Comment Creation
    createNewComment: async (req, res) => {
        try {
            const creatorid = req.session.authenticated.userid;
            const { id, content } = req.body;
            const comment = await commentModel.createComment(content, id, creatorid);
            const username = await commentModel.fetchUserUsernameWhereCommentID(comment.id);
            res.json({ comment: comment, author: username.author });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Like/Dislikes
    // ! Like Comment
    likeCommentController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const commentLiked = await commentLikedModel.fetchID(userid, id);
            if (commentLiked === null) {
                try {
                    const commentDislikedId = await commentDislikedModel.fetchID(userid, id);
                    if (commentDislikedId === null) {
                        await commentLikedModel.likeCommentAndIncrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await commentLikedModel.removeDislikedCommentAndLikeCommentAndIncrementScore(userid, id, commentDislikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await commentLikedModel.removeLikeCommentAndDecrementScore(id, commentLiked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Dislike Comment
    dislikeCommentController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const commentDisliked = await commentDislikedModel.fetchID(userid, id);
            if (commentDisliked === null) {
                try {
                    const commentLikedId = await commentLikedModel.fetchID(userid, id);
                    if (commentLikedId === null) {
                        await commentDislikedModel.dislikeCommentAndDecrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await commentDislikedModel.removeLikedCommentAndDislikeCommentAndDecrementScore(userid, id, commentLikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await commentDislikedModel.removeDislikeCommentAndIncrementScore(id, commentDisliked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Delete Comment
    deleteCommentController: async (req, res) => {
        try {
            const id = req.params.id;
            if (await replyModel.replyCountWhereCommentId(id) > 0 || await commentLikedModel.fetchCountWhereCommentId(id) > 0 || await commentDislikedModel.fetchCountWhereCommentId(id) > 0) {
                try {
                    await commentModel.softDeleteComment(id);
                    res.json({ message: 0 })
                } catch (error) {
                    res.json({ message: 2 })
                }
            } else {
                try {
                    await commentModel.hardDeleteComment(id);
                    res.json({ message: 1 })
                } catch (error) {
                    console.log(error);
                    res.json({ message: 2 })
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
    // ! Delete Comment Start
    deleteCommentControllerStart: async (id) => {
        try {
            if (await replyModel.replyCountWhereCommentId(id) > 0 || await commentLikedModel.fetchCountWhereCommentId(id) > 0 || await commentDislikedModel.fetchCountWhereCommentId(id) > 0) {
                try {
                    console.log(0);
                } catch (error) {
                    console.log(2);
                }
            } else {
                try {
                    await commentModel.hardDeleteComment(id);
                    console.log(1);
                } catch (error) {
                    console.log(error);
                    console.log(2);
                }
            }
        } catch (error) {
            console.log('server error');
        }
    },

    // -- Reply
    // ! Comment Reply Creation
    createNewReply: async (req, res) => {
        try {
            const creatorid = req.session.authenticated.userid;
            const username = req.session.authenticated.username;
            const { id, content } = req.body;
            let user = (req.body.username).trim();
            const reply = await replyModel.createReply(content, id, creatorid, user);
            res.json({ reply: reply, author: username });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // ! Fetch Replies
    fetchAllRepliesWhereCommentId: async (req, res) => {
        try {
            const user = req.session.authenticated ? req.session.authenticated.userid : null;
            const id = req.query.id;
            const replies = await replyModel.fetchRepliesWhereCommentID(id);
            for (const reply of replies) {
                reply.createdAt = dateParser.dateParse(reply.createdAt);
                if (req.session.authenticated.role === 'admin') {
                    reply.allowDeletes = true;
                } else if (user != null && reply.authorId === user) {
                    reply.allowDeletes = true;
                    if ((await replyLikedModel.fetchCountWhereUserIdAndReplyId(user, reply.id))._count != 0) {
                        reply.liked = true;
                    } else if ((await replyDislikedModel.fetchCountWhereUserIdAndReplyId(user, reply.id))._count != 0) {
                        reply.disliked = true;
                    }
                }
            };
            replies.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
            res.json(replies);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Like/Dislikes
    // ! Like Reply
    likeReplyController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const replyLiked = await replyLikedModel.fetchID(userid, id);
            if (replyLiked === null) {
                try {
                    const replyDislikedId = await replyDislikedModel.fetchID(userid, id);
                    if (replyDislikedId === null) {
                        await replyLikedModel.likeReplyAndIncrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await replyLikedModel.removeDislikedReplyAndLikeReplyAndIncrementScore(userid, id, replyDislikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await replyLikedModel.removeLikeReplyAndDecrementScore(id, replyLiked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Dislike Reply
    dislikeReplyController: async (req, res) => {
        try {
            const id = req.body.id;
            const userid = req.session.authenticated.userid;
            const replyDisliked = await replyDislikedModel.fetchID(userid, id);
            if (replyDisliked === null) {
                try {
                    const replyLikedId = await replyLikedModel.fetchID(userid, id);
                    if (replyLikedId === null) {
                        await replyDislikedModel.dislikeReplyAndDecrementScore(userid, id)
                        res.json({ message: 0 })
                    } else {
                        await replyDislikedModel.removeLikedReplyAndDislikeReplyAndDecrementScore(userid, id, replyLikedId.id)
                        res.json({ message: 3 })
                    }
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                try {
                    await replyDislikedModel.removeDislikeReplyAndIncrementScore(id, replyDisliked.id)
                    res.json({ message: 1 })
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    // ! Delete Reply
    deleteReplyController: async (req, res) => {
        try {
            const id = req.params.id;
            if (await replyLikedModel.fetchCountWhereReplyId(id) > 0 || await replyDislikedModel.fetchCountWhereReplyId(id) > 0) {
                try {
                    await replyModel.softDeleteReply(id);
                    res.json({ message: 0 })
                } catch (error) {
                    res.json({ message: 2 })
                }
            } else {
                try {
                    await replyModel.hardDeleteReply(id);
                    res.json({ message: 1 })
                } catch (error) {
                    console.log(error);
                    res.json({ message: 2 })
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },
    // ! Delete Reply Start
    deleteReplyControllerStart: async (id) => {
        try {
            if (await replyLikedModel.fetchCountWhereReplyId(id) > 0 || await replyDislikedModel.fetchCountWhereReplyId(id) > 0) {
                try {
                    console.log(0);
                } catch (error) {
                    console.log(2);
                }
            } else {
                try {
                    await replyModel.hardDeleteReply(id);
                    console.log(1);
                } catch (error) {
                    console.log(2);
                }
            }
        } catch (error) {
            console.log('server error');
        }
    },

}