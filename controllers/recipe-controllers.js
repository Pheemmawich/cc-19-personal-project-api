const prisma = require("../configs/prisma");
const { getRecipeById } = require("../services/post-service");
const createError = require("../utils/createError");
const cloudinary = require("../configs/cloudinary")
const path = require('path')
const fs = require('fs/promises')

exports.getRecipe = async (req,res,next) => {

    console.log("object");
    const {id} = req.params;

    if(!id) {
        return createError(400, "Post id to provided")
    }

    if(isNaN(Number(id))) {
        return createError(400, "Invalid id")
    }

    const recipe = await getRecipeById(id);

    console.log('recipe :>> ', recipe);

    res.json({recipe});
};


exports.createRecipe = async(req, res, next) => {
    try {
        const{name,  description, ingredient, method, category} = req.body;

        // console.log(JSON.parse(ingredient));
        // console.log(typeof JSON.parse(ingredient));

        // const data = await prisma.recipe.findFirst({where:{id:1}})
        // console.log(data);
        // console.log("__________");
        // console.log(JSON.parse(data.method));
        // console.log(typeof JSON.parse(data.method));
   

        // res.json({mag:"hello"})
        // return
        const haveFile = !!req.file    
        let uploadResult = {}
        console.log(__dirname);
        console.log(req.file);
        console.log(req.body);
	if(haveFile){
		uploadResult = await cloudinary.uploader.upload(req.file.path, {
			overwrite : true,
			public_id : path.parse(req.file.path).name,
		})
		fs.unlink(req.file.path)
	}


    if (!name) {
        return createError(400, "Name to be provided")
    }

    if (!category) {
        return createError(400, "Category tobe provided")
    }

    if (typeof category !== "string"){
        return createError(400, "Category should be string")
    }



    
    const newRecipe = await prisma.recipe.create({
        data: {
            name,
            foodImage : uploadResult.secure_url ,
            description,
            ingredient,
            method,
            user: {
                connect:{
                    id: req.user.id,
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
                    firstname:true,
                    lastname:true,
                }
            }

        }
    });


// const searchKeywords = [ "ไก่"];

// const recipes = await prisma.recipe.findMany({
//   where: {
//     AND: searchKeywords.map((keyword) => ({
//       ingredient: {
//         contains: keyword,  // ค้นหาแบบ LIKE '%keyword%'
       
//       },
//     })),
//   },
// });


// const test = recipes.map((el)=>{


// const data = JSON.stringify(el.ingredient)
// console.log(data)

// const test2 = JSON.parse(data)
// console.log("test2",typeof test2)
//     return{...el,ingredient:test2}
// })

// console.log("testtt444",test)




    res.json({ newRecipe});
    // res.json({ mes:"mes"});
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
   try {
    const { id } = req.params;
    const { name, foodImage, description, ingredient, method, category} = req.body;
    const { id : userId} = req.user

    const data = {}
    
    if(!id){
        return createError(400, "Id to be provideds")
    }

    if (name) {
       data.name = name
    }
    if (foodImage) {
       data.foodImage = foodImage
    }
    if (description) {
       data.description = description
    }
    if (ingredient) {
       data.ingredient = ingredient
    }
    if (method) {
       data.method = method
    }
    if (category) {
       data.category = category
    }

    if (!userId) {
        return createError(400, "UserId to be provided")
    }

    const recipe = await getRecipeById(id);

    if(!recipe) {
        return createError(400, "Recipe not found")
    }

    if(recipe.userId !== userId){
        return createError(403, "Forbidden");
    }
    

    const updatedRecipe = await prisma.recipe.update({
        where: {
            id: Number(id),
        },
        data: data
    });

    res.json ( { recipe: updatedRecipe } );
   } catch (error) {
    next(error)
   }
};


exports.deleteRecipe = async ( req,res,next ) => {
    const {id} = req.params;
    

    if (!id){
        return createError(400, "Id to be provided");
    }

    const recipe = await getRecipeById(id);

    if (req.user.id !== recipe.userId){
        return createError(403, "Forbidden");
    }

    await prisma.post.delete({
        where: {
            id: post.id,
        },
    });

    res.json( { messgae: "Delete Recipe" } );
};