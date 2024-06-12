const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    fetchAllReplies: async () => {
        try {
            const reply = await prisma.reply.findMany();
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchUserUsernameWhereReplyID: async (id) => {
        try {
            const user = await prisma.reply.findFirst({
                where: {
                    id: parseInt(id)
                },
                select: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    },

    fetchRepliesWhereCommentID: async (id) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    commentId: parseInt(id)
                },
                include: {
                    author: true
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchRepliesWithAuthorUsernameWhereCommentID: async (id) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    commentId: id
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchRepliesWhereCommentIDWithLimit: async (id, limit) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    commentId: id
                },
                include: {
                    author: true
                },
                take: limit
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchRepliesWhereCommentIDWithLimitAndOffset: async (id, limit, offset) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    commentId: id
                },
                include: {
                    author: true
                },
                take: limit,
                skip: offset
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllRepliesWhereCreatorID: async (id) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    creator: {
                        id: id
                    }
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllRepliesWithCommentWhereCreatorUsername: async (username) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    author: {
                        username: username
                    }
                },
                include: {
                    comment: true
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllRepliesNamesWhereCreatorID: async (id) => {
        try {
            const reply = await prisma.reply.findMany({
                where: {
                    creator: {
                        id: id
                    }
                },
                select: {
                    name: true,
                    id: true
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchReplyDataWithAuthorUsernameWhereReplyID: async (id) => {
        try {
            const reply = await prisma.reply.findFirst({
                where: {
                    id: id
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    createReply: async (content, commentId, authorId, username) => {
        try {
            const reply = await prisma.reply.create({
                data: {
                    content: content,
                    authorId: parseInt(authorId),
                    commentId: parseInt(commentId),
                    repliedToWhom: username
                }
            });

            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    incrementReplyScore: async (id) => {
        try {
            const reply = await prisma.reply.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        increment: 1
                    }
                }
            });

            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    decrementReplyScore: async (id) => {
        try {
            const reply = await prisma.reply.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        decrement: 1
                    }
                }
            });

            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCommentAuthorUsernameWhereReplyID: async (id) => {
        try {
            const comment = await prisma.reply.findFirst({
                where: {
                    id: parseInt(id)
                },
                select: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    replyCountWhereCommentId: async (commentId) => {
        try {
            const reply = await prisma.reply.count({
                where: {
                    commentId: parseInt(commentId)
                }
            })

            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    softDeleteReply: async (replyid) => {
        try {
            const reply = await prisma.reply.update({
                where: {
                    id: parseInt(replyid)
                },
                data: {
                    deleted: true
                }
            });

            return reply;
        } catch (error) {
            console.log(error);
        }
    },

    hardDeleteReply: async (replyId) => {
        try {
            await prisma.reply.delete({
                where: {
                    id: parseInt(replyId)
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    getIdWhereDeleted: async () => {
        const res = await prisma.reply.findMany({
            where: {
                deleted: true
            },
            select: {
                id: true
            }
        });

        return res;
    },
}