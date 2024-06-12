const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const path = require('path');
const fs = require('fs').promises;

module.exports = {
    fetchAllThreads: async () => {
        try {
            const thread = await prisma.thread.findMany();
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadsWhereTopicID: async (id) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    topicId: id
                },
                include: {
                    author: true
                }
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadsWithAuthorUsernameWhereTopicID: async (id) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    topicId: id
                },
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    }
                }
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadsWhereTopicIDWithLimit: async (id, limit) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    topicId: id
                },
                include: {
                    author: true
                },
                take: limit
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadsWhereTopicIDWithLimitAndOffset: async (id, limit, offset) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    topicId: id
                },
                include: {
                    author: true
                },
                take: limit,
                skip: offset
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllThreadsWhereCreatorID: async (id) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    creator: {
                        id: id
                    }
                }
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllThreadsCountWithTopicId: async (id) => {
        try {
            const topic = await prisma.thread.aggregate(
                {
                    where: {
                        topicId: id
                    },
                    _count: true
                }
            );
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllThreadsWithTopicWhereCreatorUsername: async (username) => {
        try {
            const thread = await prisma.thread.findMany({
                where: {
                    author: {
                        username: username
                    }
                },
                include: {
                    topic: {
                        select: {
                            name: true,
                            image: true,
                            url: true
                        }
                    }
                }
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllThreadNamesWhereCreatorID: async (id) => {
        try {
            const thread = await prisma.thread.findMany({
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
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadDataWithAuthorUsernameWhereThreadID: async (id) => {
        try {
            const thread = await prisma.thread.findFirst({
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
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    fetchThreadContentWhereThreadID: async (id) => {
        try {
            const thread = await prisma.thread.findFirst({
                where: {
                    id: parseInt(id)
                },
                select: {
                    content: true
                }
            });
            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    createThread: async (title, content, url, topicId, authorId) => {
        try {
            const thread = await prisma.thread.create({
                data: {
                    title: title,
                    content: content,
                    url: url,
                    authorId: authorId,
                    topicId: topicId
                }
            });

            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    incrementThreadScore: async (id) => {
        try {
            const thread = await prisma.thread.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        increment: 1
                    }
                }
            });

            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    decrementThreadScore: async (id) => {
        try {
            const thread = await prisma.thread.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    score: {
                        decrement: 1
                    }
                }
            });

            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    softDeleteThread: async (threadid) => {
        try {
            const thread = await prisma.thread.update({
                where: {
                    id: parseInt(threadid)
                },
                data: {
                    deleted: true,
                    url: `deleted-thread-${threadid}`
                }
            });

            return thread;
        } catch (error) {
            console.log(error);
        }
    },

    hardDeleteThread: async (threadId) => {
        let threadContent;

        const transaction = await prisma.$transaction([
            prisma.thread.findFirst({
                where: {
                    id: parseInt(threadId)
                },
                select: {
                    content: true
                }
            }),
            prisma.thread.delete({
                where: {
                    id: parseInt(threadId)
                }
            })
        ]);

        threadContent = transaction[0];

        if (threadContent.content.image) {
            const filePath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', threadContent.content.image.path);
            await fs.unlink(filePath);
        }

        return threadContent;
    },

    searchTitle: async (search) => {
        const searchres = await prisma.thread.findMany({
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: {
                author: true,
                topic: true
            }
        });

        return searchres;
    },

    getIdWhereDeleted: async () => {
        const res = await prisma.thread.findMany({
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