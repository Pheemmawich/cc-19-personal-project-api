const prisma = require("../configs/prisma");

exports.getRecipeById = (id) => {
    return prisma.recipe.findFirst({
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