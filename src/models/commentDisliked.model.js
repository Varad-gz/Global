const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createCommentDislike: async (userId, commentId) => {
        try {
            const commentDislike = await prisma.commentDislike.create({
                data: {
                    userId: userId,
                    commentId: commentId
                }
            });

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, commentId) => {
        try {
            const commentDislike = await prisma.commentDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId)
                },
                select: {
                    id: true
                }
            });

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    dislikeCommentAndDecrementScore: async (userId, commentId) => {
        try {
            const commentDislike = await prisma.$transaction([
                prisma.commentDislike.create({
                    data: {
                        userId: parseInt(userId),
                        commentId: parseInt(commentId)
                    }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikeCommentAndIncrementScore: async (commentId, commentDislikeId) => {
        try {
            const commentDislike = await prisma.$transaction([
                prisma.commentDislike.delete({
                    where: { id: parseInt(commentDislikeId) }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikedCommentAndDislikeCommentAndDecrementScore: async (userId, commentId, id) => {
        try {
            const commentDislike = await prisma.$transaction([
                prisma.commentLike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.commentDislike.create({
                    data: {
                        userId: parseInt(userId),
                        commentId: parseInt(commentId)
                    }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { decrement: 2 }
                    }
                })
            ]);

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteCommentDislike: async (id) => {
        try {
            const commentDislike = await prisma.commentDislike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const commentDislike = await prisma.commentDislike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereCommentId: async (id) => {
        try {
            const commentDislike = await prisma.commentDislike.findUnique({
                where: {
                    commentId: parseInt(id)
                }
            });
            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const commentDislike = await prisma.commentDislike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return commentDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndPostId: async (userId, commentId) => {
        try {
            const commentDislike = await prisma.commentDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId)
                }
            });
            return commentDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndCommentId: async (userId, commentId) => {
        try {
            const commentDislike = await prisma.commentDislike.aggregate({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId)
                },
                _count: true
            });
            return commentDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereCommentId: async (commentId) => {
        try {
            const commentDislike = await prisma.commentDislike.count({
                where: {
                    commentId: parseInt(commentId)
                }
            });
            return commentDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}