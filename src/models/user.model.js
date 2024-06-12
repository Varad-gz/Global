const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createUser: async (fname, lname, username, email, hash) => {
        try {
            const user = await prisma.user.create({
                data: {
                    fname: fname,
                    lname: lname,
                    email: email,
                    username: username,
                    password: hash
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    },

    fetchUserDataID: async (id) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    },

    fetchUserPicture: async (input) => {
        try {
            const whereCondition = isNaN(input) ? { username: input } : { id: parseInt(input) };
            const user = await prisma.user.findFirst({
                where: {
                    OR: [whereCondition]
                },
                select: {
                    picture: true
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    },

    fetchUserDataOR: async (input) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: input },
                        { username: input }
                    ]
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    },


    fetchUserDataWhereUsername: async (username) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    username: username
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    },

    updatePersonalDetails: async (id, fname, lname, username) => {
        try {
            const user = await prisma.user.update({
                data: {
                    fname: fname,
                    lname: lname,
                    username: username
                },
                where: {
                    id: id
                }
            })
            return user;
        } catch (error) {
            throw error;
        }
    },

    updateEmail: async (id, email) => {
        try {
            const user = await prisma.user.update({
                data: {
                    email: email
                },
                where: {
                    id: id
                }
            })
            return user;
        } catch (error) {
            throw error;
        }
    },

    updatePassword: async (id, hash) => {
        try {
            const user = await prisma.user.update({
                data: {
                    password: hash
                },
                where: {
                    id: id
                }
            })
            return user;
        } catch (error) {
            throw error;
        }
    },

    updateImage: async (id, imagePath) => {
        try {
            const user = await prisma.user.update({
                data: {
                    picture: imagePath
                },
                where: {
                    id: id
                }
            })
            return user;
        } catch (error) {
            throw error;
        }
    },
}