import cookieParser from "cookie-parser"
import cors from"cors"
import express from "express"
import dotenv from "dotenv"
dotenv.config({})
import connectDB from "./db/database.js";
import { UserRouter } from "./routes/userRoutes.js"
import { GroupRouter } from "./routes/groupRoutes.js"

const app = express();

//middlewares
app.use(cors({
    credentials:true,
    origin:process.env.CORS_ORIGINS
}))
app.use(cookieParser());
app.use(express.json({limit:"16kb",
}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));

//routes
app.use('/api/v1/users',UserRouter);
app.use('/api/v1/groups',GroupRouter)
//server
const port = process.env.PORT;
app.listen(port||6969,()=>{
    console.log(`server started at port ${port}`)
    connectDB().catch((err)=>{
        console.log("mongo db connection error !!",err);
    })
})