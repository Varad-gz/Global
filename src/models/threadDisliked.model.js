const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createThreadDislike: async (userId, postId) => {
        try {
            const threadDislike = await prisma.threadDislike.create({
                data: {
                    userId: userId,
                    postId: postId
                }
            });

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchID: async (userId, postId) => {
        try {
            const threadDislike = await prisma.threadDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                },
                select: {
                    id: true
                }
            });

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    dislikeThreadAndDecrementScore: async (userId, postId) => {
        try {
            const threadDislike = await prisma.$transaction([
                prisma.threadDislike.create({
                    data: {
                        userId: parseInt(userId),
                        postId: parseInt(postId)
                    }
                }),
                prisma.thread.update({
                    where: { id: parseInt(postId) },
                    data: {
                        score: { decrement: 1 }
                    }
                })
            ]);

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeDislikeThreadAndIncrementScore: async (threadId, threadDislikeId) => {
        try {
            const threadDislike = await prisma.$transaction([
                prisma.threadDislike.delete({
                    where: { id: parseInt(threadDislikeId) }
                }),
                prisma.thread.update({
                    where: { id: parseInt(threadId) },
                    data: {
                        score: { increment: 1 }
                    }
                })
            ]);

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    removeLikedThreadAndDislikeThreadAndDecrementScore: async (userId, postId, id) => {
        try {
            const threadDislike = await prisma.$transaction([
                prisma.threadLike.delete({
                    where: {
                        id: parseInt(id)
                    }
                }),
                prisma.threadDislike.create({
                    data: {
                        userId: parseInt(userId),
                        postId: parseInt(postId)
                    }
                }),
                prisma.thread.update({
                    where: { id: parseInt(postId) },
                    data: {
                        score: { decrement: 2 }
                    }
                })
            ]);

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    deleteThreadDislike: async (id) => {
        try {
            const threadDislike = await prisma.threadDislike.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereId: async (id) => {
        try {
            const threadDislike = await prisma.threadDislike.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereThreadId: async (id) => {
        try {
            const threadDislike = await prisma.threadDislike.findUnique({
                where: {
                    postId: parseInt(id)
                }
            });
            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserId: async (id) => {
        try {
            const threadDislike = await prisma.threadDislike.findUnique({
                where: {
                    userId: parseInt(id)
                }
            });
            return threadDislike;
        } catch (error) {
            console.log(error);
        }
    },

    fetchDataWhereUserIdAndPostId: async (userId, postId) => {
        try {
            const threadDislike = await prisma.threadDislike.findFirst({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                }
            });
            return threadDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWhereUserIdAndPostId: async (userId, postId) => {
        try {
            const threadDislike = await prisma.threadDislike.aggregate({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(postId)
                },
                _count: true
            });
            return threadDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    fetchCountWherePostId: async (postId) => {
        try {
            const threadDislike = await prisma.threadDislike.count({
                where: {
                    postId: parseInt(postId)
                }
            });
            return threadDislike;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
}