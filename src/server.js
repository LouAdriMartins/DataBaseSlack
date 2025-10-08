import connectMongoDB from "./config/mongoDB.config.js"
import workspace_router from "./routes/workspace.route.js"
import express from 'express'
import auth_router from "./routes/auth.route.js"
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js"

connectMongoDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/workspace', workspace_router)
app.use('/api/auth', auth_router)

app.get('/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)
    response.send({
        ok: true
    })
})

app.listen(
    8080, 
    () => {
        console.log("Esto esta funcionado")
    }
)