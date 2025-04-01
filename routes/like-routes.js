const express = require('express')
const likeRouter = express.Router()
const authenticate = require('../middlewares/authenticate')
const { createLike, deleteLike } = require('../controllers/like-controllers')

likeRouter.post('/like',authenticate, createLike)
likeRouter.delete('/like/:id',authenticate, deleteLike)

module.exports = likeRouter