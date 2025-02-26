const prisma = require("../configs/prisma");

exports.getRecipeById = (id) => {
    return prisma.post.findFirst({
        where: {
            id: Number(id),

        },
        include: {
            category: true,
            user: {
                select: {
                    id:true,
                    firstname: true,
                    lastname: true,
                },
            },
            comments: true,
            likes: true,
            favorites: true
        },
    });
}