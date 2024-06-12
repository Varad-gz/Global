const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    fetchAllComments: async () => {
        try {
            const comment = await prisma.comment.findMany();
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchUserUsernameWhereCommentID: async (id) => {
        try {
            const user = await prisma.comment.findFirst({
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

    fetchCommentsWhereThreadID: async (id) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    threadId: id
                },
                include: {
                    author: true
                }
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCommentsWithRepliesAndAuthorWhereThreadID: async (id) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    threadId: id
                },
                include: {
                    author: true,
                    replies: true
                }
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCommentsWithAuthorUsernameWhereThreadID: async (id) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    threadId: id
                },
                include: {
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

    fetchCommentsWhereThreadIDWithLimit: async (id, limit) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    threadId: id
                },
                include: {
                    author: true
                },
                take: limit
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCommentsWhereThreadIDWithLimitAndOffset: async (id, limit, offset) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    threadId: id
                },
                include: {
                    author: true
                },
                take: limit,
                skip: offset
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllCommentsWhereCreatorID: async (id) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    creator: {
                        id: id
                    }
                }
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllCommentsCountWithThreadId: async (id) => {
        try {
            const thread = await prisma.comment.aggregate(
                {
                    where: {
                        threadId: id
                    },
                    _count: true
                }
            );
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllCommentsWithThreadWhereCreatorUsername: async (username) => {
        try {
            const comment = await prisma.comment.findMany({
                where: {
                    author: {
                        username: username
                    }
                },
                include: {
                    thread: true
                }
            });
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllCommentNamesWhereCreatorID: async (id) => {
        try {
            const comment = await prisma.comment.findMany({
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
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCommentDataWithAuthorUsernameWhereCommentID: async (id) => {
        try {
            const comment = await prisma.comment.findFirst({
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
            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    createComment: async (content, threadId, authorId) => {
        try {
            const comment = await prisma.comment.create({
                data: {
                    content: content,
                    authorId: parseInt(authorId),
                    threadId: parseInt(threadId)
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    incrementCommentScore: async (id) => {
        try {
            const comment = await prisma.comment.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        increment: 1
                    }
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    decrementCommentScore: async (id) => {
        try {
            const comment = await prisma.comment.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        decrement: 1
                    }
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    commentCountWhereThreadId: async (threadId) => {
        try {
            const count = await prisma.comment.count({
                where: {
                    threadId: parseInt(threadId)
                }
            })

            return count;
        } catch (error) {
            console.log(error);
        }
    },

    softDeleteComment: async (commentid) => {
        try {
            const comment = await prisma.comment.update({
                where: {
                    id: parseInt(commentid)
                },
                data: {
                    deleted: true
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
        }
    },

    hardDeleteComment: async (commentId) => {
        try {
            await prisma.comment.delete({
                where: {
                    id: parseInt(commentId)
                }
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    getIdWhereDeleted: async () => {
        const res = await prisma.comment.findMany({
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