const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    getAllCategories: async () => {
        try {
            const categories = await prisma.category.findMany();
            return categories;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategoriesWithTopics: async () => {
        try {
            const categories = await prisma.category.findMany({
                where: {
                    topics: {
                        some: {}
                    }
                },
                include: {
                    topics: true
                }
            });
            return categories;
        } catch (error) {
            console.log(error);
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    id: categoryId
                }
            });
            return category;
        } catch (error) {
            console.log(error);
        }
    },

    getCategoryByURL: async (url) => {
        try {
            const category = await prisma.category.findUnique({
                where: {
                    url: url
                }
            });
            return category;
        } catch (error) {
            console.log(error);
        }
    },

    deleteCategoryById: async (categoryId) => {
        try {
            const category = await prisma.category.delete({
                where: {
                    id: categoryId
                }
            });
            return category;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategoryNamesAndURL: async () => {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    name: true,
                    id: true,
                    url: true
                }
            });
            return categories;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategoryNames: async () => {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    name: true,
                    id: true
                }
            });
            return categories;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategoryNamesAndTopicCount: async () => {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                    topics: true
                }
            });
            return categories;
        } catch (error) {
            console.log(error);
        }
    },

    getAllCategoryDescriptions: async () => {
        try {
            const categories = await prisma.category.findMany({
                select: {
                    description: true,
                    id: true
                }
            });
            return categories;
        } catch (error) {
            console.log(error);
        }
    },


    createCategory: async (name, description, url) => {
        const newCategory = await prisma.category.create({
            data: {
                name: name,
                description: description,
                url: url
            }
        });
        return newCategory;
    },

    editCategory: async (id, name, description, url) => {
        const newCategory = await prisma.category.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description,
                url: url
            }
        });
        return newCategory;
    },

    searchTitle: async (search) => {
        const searchres = await prisma.category.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            },
            include: {
                _count: {
                    select: {
                        topics: true
                    }
                }
            }
        });

        return searchres;
    },
}