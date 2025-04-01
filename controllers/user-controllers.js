const prisma = require("../configs/prisma");
const createError = require("../utils/createError");

exports.getTopCreator = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        recipes: {
          include: {
            likes: true,
          },
        },
      },
    });

    // นับจำนวน likes รวมทั้งหมดของแต่ละ user
    const usersWithLikesCount = allUsers.map((user) => {
      // นับจำนวน like สำหรับแต่ละ recipe ของ user
      const totalLikes = user.recipes.reduce(
        (total, recipe) => total + recipe.likes.length,
        0
      );
      return {
        ...user,
        totalLikes,
      };
    });

    // เรียงลำดับ user ตามจำนวน likes ที่มากที่สุดและเลือก 10 อันดับแรก
    const top10Users = usersWithLikesCount
      .sort((a, b) => b.totalLikes - a.totalLikes) // เรียงจากมากไปน้อย
      .slice(0, 10); // เลือกแค่ 10 อันดับแรก

    res.json(top10Users);
  } catch (error) {
    next(error);
  }
};

exports.getuserById = async (req, res, next) => {
  try {
    console.log("object");
    const { id } = req.params;

    if (!id) {
      return createError(400, "user id to provided");
    }

    if (isNaN(Number(id))) {
      return createError(400, "Invalid id");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  //code
  try {
    console.log(req.user);
    const users = await prisma.user.findMany({
      // select:{
      //     id: true,
      //     email: true,
      //     firstname: true,
      //     lastname: true,
      //     role: true,
      //     createdAt: true,
      //     updatedAt: true,
      // },
      omit: {
        password: true,
      },
    });
    console.log(users);
    res.json({ message: "Hello, List users", result: users });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;
    console.log(id, role);
    //console.log(typeof id)

    const updated = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role.toUpperCase(),
      },
    });

    res.json({ message: "Hello, Update Role" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Delete success" });
  } catch (error) {
    next(error);
  }
};
