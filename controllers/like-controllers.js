const prisma = require("../configs/prisma")
const createError = require("../utils/createError")



module.exports.createLike =  async (req,res,next) => {
    try {
        const {recipeId} = req.body
	// validate already like
	const recipeData = await prisma.recipe.findUnique({where : {id : Number(recipeId)} })
	if(!recipeData) {
		createError(401, "Cannot like this recipe")
	}
	const like = await prisma.like.create({
		data: {userId: req.user.id, recipeId: Number(recipeId)}
	})
	res.json({like})
    } catch (error) {
        next(error)
    }
}

module.exports.deleteLike =  async (req,res,next) => {
    try {
        const {id} = req.params //postId
        
        console.log(id);

    
        // validate already unlike
        const deletedLike = await prisma.like.delete({
            where : { userId_recipeId : {
                userId : req.user.id,
                recipeId : +id
            }
        }
        })


        res.json({deletedLike})
        
    } catch (error) {
        next(error)
    }
}