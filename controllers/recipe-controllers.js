const { getRecipeById } = require("../services/post-service");

exports.getRecipe = async (req,res,next) => {
    const {id} = req.params;

    if(!id) {
        return createError(400, "Post id to provided")
    }

    if(isNaN(Number(id))) {
        return createError(400, "Invalid id")
    }

    const recipe = await getRecipeById;

    res.json({recipe});
};


exports.createPost = async(req, res, next) => {
    try {
        const{name, foodImage, description, ingredient, method, category} = req.body;

    if (!name) {
        return createError(400, "Name to be provided")
    }

    if (!category) {
        return createError(400, "Category tobe provided")
    }

    if (typeof category !== "string"){
        return createError(400, "Category should be string")
    }

    const newRecipe = await prisma.post.create({
        data: {
            name,
            foodImage,
            description,
            ingredient, 
            method,
            user: {
                connect:{
                    id:req.user.id,
                },
            },
            category: {
                connect:{
                    name: category,
                },
            },
        },
        include: {
            category: true,
            user: {
                select:{
                    id:true,
                    firstName:true,
                    lastName:true,
                }
            }

        }
    });

    res.json({ newRecipe});
    } catch (err) {
        next(err);
    }
};