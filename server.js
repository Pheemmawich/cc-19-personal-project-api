const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
// Routing
const authRouter = require("./routes/auth-router")
const userRouter = require("./routes/user-router")
const recipeRouter = require("./routes/recipe-router")
const handleError = require("./middlewares/handleError")
const notFound = require("./middlewares/notFound")
const commentRouter = require("./routes/comment-routes")
const likeRouter = require("./routes/like-routes")

const app = express()

// Middlewares
app.use(cors()) // Allows cross domain
app.use(morgan("dev")) // Show log terminal
app.use(express.json()) // For read json

// Routing 
app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api', recipeRouter )
app.use('/api', commentRouter )
app.use('/api', likeRouter )

// Handle errors
app.use(handleError)
// not found
app.use(notFound)

// Start Server
const PORT = 8000
app.listen(PORT,()=> console.log(`Server is runnig on port ${PORT}`))