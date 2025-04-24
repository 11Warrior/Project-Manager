import express from "express"
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "./Database/connectDB.js";

//route imports
import authRoutes from "./routes/auth.routes.js"
import groupRoutes from "./routes/groupProjects.routes.js"
import taskRoutes from "./routes/tasks.routes.js"

config()
const app = express();

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
  res.send("Server is up");
})

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
  connectDB(process.env.MONGO_URI)
})
