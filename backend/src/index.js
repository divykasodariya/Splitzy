import cookieParser from "cookie-parser"
import cors from"cors"
import express from "express"
import dotenv from "dotenv"
dotenv.config({})
import connectDB from "./db/database.js";
import{ UserRouter} from "./routes/userRoutes.js"
import { GroupRouter } from "./routes/groupRoutes.js"
import { TransRouter } from "./routes/transactionRoutes.js"

const app = express();

//middlewares
app.use(cookieParser());
app.use(cors({
    origin:['http://localhost:3000',
    'http://localhost:5173',
    
    ],
    credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({limit:"16kb",
}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));

//routes
app.use('/api/v1/users',UserRouter);
app.use('/api/v1/groups',GroupRouter)
app.use('/api/v1/trsn',TransRouter)
//server
const port = process.env.PORT;
app.listen(port||6969,()=>{
    console.log(`server started at port ${port}`)
    connectDB().catch((err)=>{
        console.log("mongo db connection error !!",err);
    })
})