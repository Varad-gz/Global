const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    fetchAllTopics: async () => {
        try {
            const topic = await prisma.topic.findMany();
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllTopicsWhereCreatorID: async (id) => {
        try {
            const topic = await prisma.topic.findMany({
                where: {
                    creator: {
                        id: id
                    }
                }
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllTopicNamesWhereCreatorID: async (id) => {
        try {
            const topic = await prisma.topic.findMany({
                where: {
                    creator: {
                        id: id
                    }
                },
                select: {
                    name: true,
                    id: true,
                    image: true
                }
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    fetchTopicDataWhereID: async (id) => {
        try {
            const topic = await prisma.topic.findUnique({
                where: {
                    id: id
                }
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    fetchTopicImageWhereID: async (id) => {
        try {
            const topic = await prisma.topic.findUnique({
                where: {
                    id: id
                },
                select: {
                    image: true
                }
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    createTopic: async (name, description, image, categoryID, creatorID, url) => {
        try {
            const topic = await prisma.topic.create({
                data: {
                    name: name,
                    description: description,
                    image: image,
                    url: url,
                    category: { connect: { id: categoryID } },
                    creator: { connect: { id: creatorID } }
                }
            });

            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    topicsWhereCategoryUrlWithCatName: async (url) => {
        try {
            const topics = await prisma.topic.findMany({
                where: {
                    category: {
                        url: url
                    }
                },
                include: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return topics;
        } catch (error) {
            console.log(error);
        }
    },

    topicWhereURL: async (url) => {
        try {
            const topic = await prisma.topic.findUnique({
                where: {
                    url: url
                },
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    topicWhereURLWithCreator: async (url) => {
        try {
            const topic = await prisma.topic.findUnique({
                where: {
                    url: url
                },
                include: {
                    creator: true
                }
            });
            return topic;
        } catch (error) {
            console.log(error);
        }
    },

    deleteTopicById: async (id) => {
        try {
            const category = await prisma.topic.delete({
                where: {
                    id: id
                }
            });
            return category;
        } catch (error) {
            console.log(error);
        }
    },

    updateTopic: async (id, name, description, url, categoryid) => {
        const newCategory = await prisma.topic.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description,
                url: url,
                category: { connect: { id: categoryid } }
            }
        });
        return newCategory;
    },

    updateImage: async (id, imagePath) => {
        try {
            const topic = await prisma.topic.update({
                data: {
                    image: imagePath
                },
                where: {
                    id: id
                }
            })
            return topic;
        } catch (error) {
            throw error;
        }
    },

    searchTitle: async (search) => {
        const searchres = await prisma.topic.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: {
                _count: {
                    select: {
                        threads: true
                    }
                }
            }
        });

        return searchres;
    },
}