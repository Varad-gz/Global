const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createCommentLike: async (userId, commentId) => {
        try {
            const commentLike = await prisma.commentLike.create({
                data: {
                    userId: userId,
                    commentId: commentId
                }
            });

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, commentId) => {
        try {
            const commentLike = await prisma.commentLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId),
                },
                select: {
                    id: true
                }
            });

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    likeCommentAndIncrementScore: async (userId, commentId) => {
        try {
            const commentLike = await prisma.$transaction([
                prisma.commentLike.create({
                    data: {
                        userId: parseInt(userId),
                        commentId: parseInt(commentId)
                    }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikedCommentAndLikeCommentAndIncrementScore: async (userId, commentId, id) => {
        try {
            const commentLike = await prisma.$transaction([
                prisma.commentDislike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.commentLike.create({
                    data: {
                        userId: parseInt(userId),
                        commentId: parseInt(commentId)
                    }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { increment: 2 }
                    }
                })
            ]);

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikeCommentAndDecrementScore: async (commentId, commentLikeId) => {
        try {
            const commentLike = await prisma.$transaction([
                prisma.commentLike.delete({
                    where: { id: parseInt(commentLikeId) }
                }),
                prisma.comment.update({
                    where: { id: parseInt(commentId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteCommentLike: async (id) => {
        try {
            const commentLike = await prisma.commentLike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const commentLike = await prisma.commentLike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereCommentId: async (id) => {
        try {
            const commentLike = await prisma.commentLike.findUnique({
                where: {
                    commentId: parseInt(id)
                }
            });
            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const commentLike = await prisma.commentLike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return commentLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndCommentId: async (userId, commentId) => {
        try {
            const commentLike = await prisma.commentLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId)
                }
            });
            return commentLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndCommentId: async (userId, commentId) => {
        try {
            const commentLike = await prisma.commentLike.aggregate({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(commentId),
                },
                _count: true
            });
            return commentLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereCommentId: async (commentId) => {
        try {
            const commentLike = await prisma.commentLike.count({
                where: {
                    commentId: parseInt(commentId)
                }
            });
            return commentLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}