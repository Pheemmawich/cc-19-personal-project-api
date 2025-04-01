const prisma = require("../configs/prisma");

exports.getRecipeById = async (id) => {
    console.log('idในฟังชั่น',id)
    return await prisma.recipe.findFirst({
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
                    profileImage: true
                },
            },
            comments: true,
            likes: true,
            favorites: true
        },
    });
}