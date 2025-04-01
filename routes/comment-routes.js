const express = require('express')
const commentRouter = express.Router()
const { createComment, deleteComment } = require('../controllers/comment-controllers')
const authenticate = require('../middlewares/authenticate')

commentRouter.post('/comment',authenticate, createComment )
commentRouter.delete('/comment/:commentId',authenticate, deleteComment )

module.exports = commentRouter