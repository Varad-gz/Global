const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createThreadLike: async (userId, postId) => {
        try {
            const threadLike = await prisma.threadLike.create({
                data: {
                    userId: userId,
                    postId: postId
                }
            });

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, postId) => {
        try {
            const threadLike = await prisma.threadLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                },
                select: {
                    id: true
                }
            });

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    likeThreadAndIncrementScore: async (userId, postId) => {
        try {
            const threadLike = await prisma.$transaction([
                prisma.threadLike.create({
                    data: {
                        userId: parseInt(userId),
                        postId: parseInt(postId)
                    }
                }),
                prisma.thread.update({
                    where: { id: parseInt(postId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikedThreadAndLikeThreadAndIncrementScore: async (userId, postId, id) => {
        try {
            const threadLike = await prisma.$transaction([
                prisma.threadDislike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.threadLike.create({
                    data: {
                        userId: parseInt(userId),
                        postId: parseInt(postId)
                    }
                }),
                prisma.thread.update({
                    where: { id: parseInt(postId) },
                    data: {
                        score: { increment: 2 }
                    }
                })
            ]);

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikeThreadAndDecrementScore: async (threadId, threadLikeId) => {
        try {
            const threadLike = await prisma.$transaction([
                prisma.threadLike.delete({
                    where: { id: parseInt(threadLikeId) }
                }),
                prisma.thread.update({
                    where: { id: parseInt(threadId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteThreadLike: async (id) => {
        try {
            const threadLike = await prisma.threadLike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const threadLike = await prisma.threadLike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereThreadId: async (id) => {
        try {
            const threadLike = await prisma.threadLike.findUnique({
                where: {
                    postId: parseInt(id)
                }
            });
            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const threadLike = await prisma.threadLike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return threadLike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndPostId: async (userId, postId) => {
        try {
            const threadLike = await prisma.threadLike.findFirst({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                }
            });
            return threadLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndPostId: async (userId, postId) => {
        try {
            const threadLike = await prisma.threadLike.aggregate({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                },
                _count: true
            });
            return threadLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWherePostId: async (postId) => {
        try {
            const threadLike = await prisma.threadLike.count({
                where: {
                    postId: parseInt(postId)
                }
            });
            return threadLike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}