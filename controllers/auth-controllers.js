const prisma = require("../configs/prisma");
const createError = require("../utils/createError");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

function checkEmailorPhone(identity) {
	let identityKey = ''
	if(/^[0-9]{10,15}$/.test(identity)) {
		identityKey = 'phoneNumber'
	}
	if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity)) {
		identityKey = 'email'
	}
	if(!identityKey) {
		createError(400, 'only email or phone number')
	}
	return identityKey
}

exports.register = async (req,res,next)=>{
    try{
        //code
        // Step 1 req.body
        const { identity, firstname, lastname, password, confirmPassword} = req.body;
    
        // check identity is mobile or email
	    const identityKey = checkEmailorPhone(identity)

        // check if already email / mobile in User data
        const findIdentity = await prisma.user.findUnique({
            where : { [identityKey] : identity}
        })

        if(findIdentity) {
            createError(409,`This ${identityKey} already exists`)
        }
        
        // Encrypt bcrypt
        const hashedPassword = await bcrypt.hash(password,10)
        
        // Insert to DB
        const profile = await prisma.user.create({
            data:{
                [identityKey] : identity,
                firstname: firstname,
                lastname: lastname,
                password: hashedPassword,
            }
        })
        // Response
        res.status(201).json({message : 'register success', profile});
    }catch(error){
        console.log("Step 2 Catch");
       next(error);
    };
}

exports.login = async (req,res,next)=>{
    try {
        const {identity, password} = req.body

        const identityKey = checkEmailorPhone(identity)

        const profile = await prisma.user.findUnique({
            where: {
                [identityKey] : identity
            }
        })

        if(!profile){
            return createError(401, "This email or phone number is not found")
        }

        const isMatch =await bcrypt.compare(password, profile.password)

        if(!isMatch){
            return createError(401, "Incorrect password")
        }

        const payload = {
            id: profile.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn : '15d'})
        const { password : pw, createdAt, updatedAt, ...userData} = profile

        res.json({token : token, user: userData})

    } catch (error) {
        console.log(error.message)
        next(error)
    }    
}

exports.currentUser = async(req, res, next) => {
    try {
        res.json({user : req.user})
    } catch (error) {
        console.log(error);
        next(error)
    }
}  