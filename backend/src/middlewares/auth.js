import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const isAuth= async (req,res,next)=>{
try {
    const token=req.cookies.token;
    if(token){
    
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    const user =await User.findOne({email:decoded.email});
    req._id=user._id;

    next();
     
}
else{
    res.status(401).json({
        success:false,
        message:"unauthorised! please login",

    })
}
} catch (error) {
 throw new ApiError(500,"failed authorisation process",[error]);   
}
    
}
export {isAuth};