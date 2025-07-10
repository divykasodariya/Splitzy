import mongoose from "mongoose"
const connectDB=async()=>{
try {
    const connectioninstance=await mongoose.connect(process.env.MONGODB_URI)
    console.log(`successfully connected db : \n ${connectioninstance.connection.host}`)
} catch (error) {
    console.log("error in connection of db",error)
}
}
export default connectDB;