const createError = require("../utils/createError");
const jwt = require('jsonwebtoken')
const prisma = require('../configs/prisma')


module.exports = async (req, res, next) => {
	try {
		const authorization = req.headers.authorization
		if(!authorization || !authorization.startsWith('Bearer')){
			return createError(401, 'Unauthorized 1')
		}

		const token = authorization.split(' ')[1]
		
		if(!token){
			createError(401, 'Unauthorized')
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET)

		const profile = await prisma.user.findUnique({
			where:{
				id: payload.id
			}
		})
		if(!profile){
			createError(401, 'Unauthorized')
		}

		const {password, createdAt, updatedAt, ...userData} = profile
		req.user = userData
		next()
	} catch (error) {
		next(error)
	}
}