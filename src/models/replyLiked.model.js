const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createReplyLike: async (userId, replyId) => {
        try {
            const replyLike = await prisma.replyLike.create({
                data: {
                    userId: userId,
                    replyId: replyId
                }
            });

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, replyId) => {
        try {
            const replyLike = await prisma.replyLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId),
                },
                select: {
                    id: true
                }
            });

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    likeReplyAndIncrementScore: async (userId, replyId) => {
        try {
            const replyLike = await prisma.$transaction([
                prisma.replyLike.create({
                    data: {
                        userId: parseInt(userId),
                        replyId: parseInt(replyId)
                    }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikedReplyAndLikeReplyAndIncrementScore: async (userId, replyId, id) => {
        try {
            const replyLike = await prisma.$transaction([
                prisma.replyDislike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.replyLike.create({
                    data: {
                        userId: parseInt(userId),
                        replyId: parseInt(replyId)
                    }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { increment: 2 }
                    }
                })
            ]);

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikeReplyAndDecrementScore: async (replyId, replyLikeId) => {
        try {
            const replyLike = await prisma.$transaction([
                prisma.replyLike.delete({
                    where: { id: parseInt(replyLikeId) }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteReplyLike: async (id) => {
        try {
            const replyLike = await prisma.replyLike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const replyLike = await prisma.replyLike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereReplyId: async (id) => {
        try {
            const replyLike = await prisma.replyLike.findUnique({
                where: {
                    replyId: parseInt(id)
                }
            });
            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const replyLike = await prisma.replyLike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return replyLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndReplyId: async (userId, replyId) => {
        try {
            const replyLike = await prisma.replyLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId)
                }
            });
            return replyLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndReplyId: async (userId, replyId) => {
        try {
            const replyLike = await prisma.replyLike.aggregate({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId),
                },
                _count: true
            });
            return replyLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereReplyId: async (replyId) => {
        try {
            const replyLike = await prisma.replyLike.count({
                where: {
                    replyId: parseInt(replyId)
                }
            });
            return replyLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}