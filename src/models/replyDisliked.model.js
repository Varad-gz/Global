const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createReplyDislike: async (userId, replyId) => {
        try {
            const replyDislike = await prisma.replyDislike.create({
                data: {
                    userId: userId,
                    replyId: replyId
                }
            });

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, replyId) => {
        try {
            const replyDislike = await prisma.replyDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId)
                },
                select: {
                    id: true
                }
            });

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    dislikeReplyAndDecrementScore: async (userId, replyId) => {
        try {
            const replyDislike = await prisma.$transaction([
                prisma.replyDislike.create({
                    data: {
                        userId: parseInt(userId),
                        replyId: parseInt(replyId)
                    }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikeReplyAndIncrementScore: async (replyId, replyDislikeId) => {
        try {
            const replyDislike = await prisma.$transaction([
                prisma.replyDislike.delete({
                    where: { id: parseInt(replyDislikeId) }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikedReplyAndDislikeReplyAndDecrementScore: async (userId, replyId, id) => {
        try {
            const replyDislike = await prisma.$transaction([
                prisma.replyLike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.replyDislike.create({
                    data: {
                        userId: parseInt(userId),
                        replyId: parseInt(replyId)
                    }
                }),
                prisma.reply.update({
                    where: { id: parseInt(replyId) },
                    data: {
                        score: { decrement: 2 }
                    }
                })
            ]);

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteReplyDislike: async (id) => {
        try {
            const replyDislike = await prisma.replyDislike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const replyDislike = await prisma.replyDislike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereReplyId: async (id) => {
        try {
            const replyDislike = await prisma.replyDislike.findUnique({
                where: {
                    replyId: parseInt(id)
                }
            });
            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const replyDislike = await prisma.replyDislike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return replyDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndPostId: async (userId, replyId) => {
        try {
            const replyDislike = await prisma.replyDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId)
                }
            });
            return replyDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndReplyId: async (userId, replyId) => {
        try {
            const replyDislike = await prisma.replyDislike.aggregate({
                where: {
                    userId: parseInt(userId),
                    replyId: parseInt(replyId)
                },
                _count: true
            });
            return replyDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereReplyId: async (replyId) => {
        try {
            const replyDislike = await prisma.replyDislike.count({
                where: {
                    replyId: parseInt(replyId)
                }
            });
            return replyDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}