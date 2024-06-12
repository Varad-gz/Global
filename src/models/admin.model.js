const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    createAdmin: async (fname, lname, email, hash) => {
        try {
            const admin = await prisma.admin.create({
                data: {
                    fname: fname,
                    lname: lname,
                    email: email,
                    password: hash
                }
            });

            return admin;
        } catch (error) {
            console.log(error);
        }
    },

    fetchAdminData: async (email) => {
        try {
            const admin = await prisma.admin.findUnique({
                where: {
                    email: email
                }
            });
            return admin;
        } catch (error) {
            console.log(error);
        }
    }
}