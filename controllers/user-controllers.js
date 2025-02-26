const prisma = require("../configs/prisma")

exports.listUsers = async (req, res, next) => {
    //code
    try {
        console.log(req.user)
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
            omit:{
                password: true,
            }
        });
        console.log(users);
        res.json({message: "Hello, List users", result: users});
    } catch (error) {
        next(error);
    }
};

exports.updateRole = async (req, res, next) => {
    try {
        const {id, role} = req.body;
        console.log(id,role);
        //console.log(typeof id)

        const updated = await prisma.user.update({
            where:{
                id: Number(id),
            },
            data:{
                role: role.toUpperCase(),
            }
        })

        res.json({ message: "Hello, Update Role"});
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const deleted = await prisma.user.delete({
            where:{
                id:Number(id),
            }
        })

        res.json({ message: "Delete success"});
    } catch (error) {
        next(error);
    }
};

