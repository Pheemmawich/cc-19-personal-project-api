const prisma = require("../configs/prisma");
const { getRecipeById } = require("../services/post-service");
const createError = require("../utils/createError");
const cloudinary = require("../configs/cloudinary");
const path = require("path");
const fs = require("fs/promises");

exports.getRecipeByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (!category) {
      return createError(400, "category to provided");
    }

    if (typeof category !== "string") {
      return createError(400, "Invalid category");
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        category: {
          name: category, // เปลี่ยนเป็นหมวดหมู่ที่ต้องการค้นหา
        },
      },
    });

    res.json({ recipes });
  } catch (error) {
    next(error);
  }
};

exports.getRecipeByUserId = async (req, res, next) => {
  try {
    console.log("object");
    const { id } = req.params;

    if (!id) {
      return createError(400, "user id to provided");
    }

    if (isNaN(Number(id))) {
      return createError(400, "Invalid id");
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        userId: Number(id),
        deletedAt: null,
      },
    });

    res.json({ recipes });
  } catch (error) {
    next(error);
  }
};

const filterbyIngredient = (recipes, ingredients) => {
  const rankedRecipes = recipes
    .map((recipe) => {
      const recipeIngredients = JSON.parse(recipe.ingredient) // แปลง JSON string เป็น array
        .map((ing) => ing.text.trim()) // ดึง text และตัดช่องว่าง
        .filter((text) => text !== ""); // ลบค่าว่าง

      // คำนวณจำนวนที่ตรงกัน
      const matchCount = ingredients.filter((ingredient) =>
        recipeIngredients.includes(ingredient.text)
      ).length;

      return { ...recipe, matchCount };
    })
    .filter((r) => r.matchCount > 0) // เอาเฉพาะเมนูที่มี ingredient ตรงกัน
    .sort((a, b) => b.matchCount - a.matchCount); // เรียงลำดับจากมากไปน้อย
  // .slice(0, 3); // เอาแค่ 3 อันดับแรก

  return rankedRecipes;
};

exports.getRecipeByIngredient = async (req, res, next) => {
  // ["กะเพรา","ไก่"]
  try {
    const ingredients = req.body;
    console.log(ingredients);
    // const recipes = await prisma.recipe.findMany();
    const recipes = await prisma.recipe.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            profileImage: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    // console.log("recipes", recipes);

    const result = await filterbyIngredient(recipes, ingredients);

    console.log("result", result);

    res.json({ result });
  } catch (error) {
    next(error);
  }
};

// async function searchRecipesByIngredients(ingredients) {
//     try {
//       // Convert each ingredient into a LIKE '%ingredient%' format for partial matching
//       const conditions = ingredients
//         .map((ing) => `ingredient LIKE '%${ing.text}%'`)
//         .join(" OR ");

//       const query = `
//       SELECT Recipe.*, Category.name AS categoryName
//             FROM Recipe
//             JOIN Category ON Recipe.categoryId = Category.id
//             WHERE ${conditions}
//       `;

//       const recipes = await prisma.$queryRawUnsafe(query);

//       // Rank recipes based on number of matching ingredients
//       const rankedRecipes = recipes
//         .map((recipe) => {
//           const recipeIngredients = JSON.parse(recipe.ingredient)
//             .map((ing) => ing.text.trim())
//             .filter((text) => text !== "");

//           // Count how many ingredients match partially
//           const matchCount = ingredients.filter((ingredient) =>
//             recipeIngredients.some((ing) => ing.includes(ingredient.text))
//           ).length;

//           return { ...recipe, matchCount };
//         })
//         .filter((r) => r.matchCount > 0) // Keep only recipes that have at least one match
//         .sort((a, b) => b.matchCount - a.matchCount) // Sort from highest to lowest match
//         .slice(0, 3); // Get only top 3 results

//       return rankedRecipes;
//     } catch (error) {
//       console.error("Error fetching recipes:", error);
//     }
//   }

// exports.getRecipeByIngredient = async (req, res, next) => {
//     // ["กะเพรา","ไก่"]
//     try {
//         // const ingredients = [
//         //     {id: 1, text: "กระ"},
//         //     {id: 2, text: "ไข่"},
//         //     {id: 3, text: "หมู"},
//         //   ];
//         const ingredients = req.body

//         const result = await searchRecipesByIngredients( ingredients)

//         console.log(result);

//         res.json({result})
//     } catch (error) {
//         next(error)
//     }
// }

exports.getRecommendRecipe = async (req, res, next) => {
  const { page = "1", limit = "10" } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const recipes = await prisma.recipe.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          profileImage: true,
        },
      },
      likes: true,
      category: true,
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
    skip: skip,
    take: Number(limit),
  });

  res.status(200).json({ recipes });
};

exports.getAllMyRecipes = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log(id);

    if (!id) {
      return createError(400, "Post id to provided");
    }

    if (isNaN(Number(id))) {
      return createError(400, "Invalid id");
    }

    const allRecipe = await prisma.recipe.findMany({
      where: {
        userId: id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
        likes: true,
        category: true,
      },
    });
    res.json(allRecipe);
  } catch (error) {
    next(error);
  }
};

exports.getRecipe = async (req, res, next) => {
  try {
    console.log("object");
    const { id } = req.params;

    if (!id) {
      return createError(400, "Post id to provided");
    }

    if (isNaN(Number(id))) {
      return createError(400, "Invalid id");
    }

    const recipe = await getRecipeById(id);

    console.log("recipe :>> ", recipe);

    res.json({ recipe });
  } catch (error) {
    next(error);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    const { name, description, ingredient, method, category } = req.body;

    // console.log(JSON.parse(ingredient));
    // console.log(typeof JSON.parse(ingredient));

    // const data = await prisma.recipe.findFirst({where:{id:1}})
    // console.log(data);
    // console.log("__________");
    // console.log(JSON.parse(data.method));
    // console.log(typeof JSON.parse(data.method));

    // res.json({mag:"hello"})
    // return
    const haveFile = !!req.file;
    let uploadResult = {};
    console.log(__dirname);
    console.log(req.file);
    console.log(req.body);
    if (haveFile) {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        overwrite: true,
        public_id: path.parse(req.file.path).name,
      });
      fs.unlink(req.file.path);
    }
    if (!name) {
      return createError(400, "Name to be provided");
    }

    if (!category) {
      return createError(400, "Category tobe provided");
    }

    if (typeof category !== "string") {
      return createError(400, "Category should be string");
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        foodImage: uploadResult.secure_url,
        description,
        ingredient,
        method,
        user: {
          connect: {
            id: req.user.id,
          },
        },
        category: {
          connect: {
            name: category,
          },
        },
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
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

    res.json({ newRecipe });
    // res.json({ mes:"mes"});
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  console.log("updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  try {
    const { id } = req.params;
    const { name, description, ingredient, method, category } = req.body;
    const { id: userId } = req.user;
    console.log("8jkmujiy[,k", name, description, ingredient, method, category);
    const data = {};

    const haveFile = !!req.file;

    let imageFromResult = "";
    console.log(__dirname);
    console.log(req.file);
    console.log(req.body);

    if (haveFile) {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        overwrite: true,
        public_id: path.parse(req.file.path).name,
      });
      console.log("uploadResult", uploadResult);
      imageFromResult = uploadResult.secure_url;
      fs.unlink(req.file.path);
    }

    if (!id) {
      return createError(400, "Id to be provideds");
    }

    if (name) {
      data.name = name;
    }
    if (imageFromResult) {
      data.foodImage = imageFromResult;
    }
    if (description) {
      data.description = description;
    }
    if (ingredient) {
      data.ingredient = ingredient;
    }
    if (method) {
      data.method = method;
    }

    if (!userId) {
      return createError(400, "UserId to be provided");
    }

    const recipe = await getRecipeById(id);

    if (!recipe) {
      return createError(400, "Recipe not found");
    }

    if (recipe.userId !== userId) {
      return createError(403, "Forbidden");
    }

    const updatedRecipe = await prisma.recipe.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data,
        category: {
          connect: {
            name: category,
          },
        },
      },
    });

    res.json({ recipe: updatedRecipe });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id) {
      return createError(400, "Id to be provided");
    }

    console.log("step1");

    const recipe = await getRecipeById(id);

    console.log("step2");
    console.log("recipe", recipe);

    if (req.user.id !== recipe.userId) {
      return createError(403, "Forbidden");
    }

    console.log("step3");

    // const deletedRecipe = await prisma.recipe.delete({
    //     where: {
    //         id: Number(recipe.id),
    //     },
    // });

    const deletedRecipe = await prisma.recipe.update({
      where: {
        id: Number(recipe.id),
      },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({ deletedRecipe });
  } catch (error) {
    next(error);
  }
};
