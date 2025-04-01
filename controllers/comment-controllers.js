const prisma = require("../configs/prisma")
const createError = require("../utils/createError")




module.exports.createComment = async (req,res,next) => {
    try {
        const {message, recipeId : menuId} = req.body
	const userId = req.user.id
	// validation
	const recipeData = await prisma.recipe.findUnique({
        where : {
            id : Number(menuId)
        } 
    })
	if(!recipeData) {
		createError(401, "recipe not found")
	}
	const comment = await prisma.comment.create({
		data : {message, menuId : Number(menuId), userId}
	})
	res.json({comment})
    } catch (error) {
        next(error)
    }
} 

exports.deleteComment = async (req,res,next) => {
    try {
        const {commentId} = req.params;
        

        if (!commentId){
            return createError(400, "commentId to be provided");
        }

        const comment = await prisma.comment.findFirst({
            where: {
                id: Number(commentId),
            },
        });

        if(comment.userId !== req.user.id){
            return createError(403, "Forbidden")
        }

        const deletedComment = await prisma.comment.delete({
            where: {
                id: Number(commentId),
            },
        });
        

        res.json( { deletedComment } );
    } catch (err) {
        next(err);
    }
};