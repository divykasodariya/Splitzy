// const asyncHandler = (fn)=> async (req,res,next)=>{
//     try {
//         await fn(req,res,next);

//     } catch (error) {
//         console.log(error);
//         next(error)
//     }
// }

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export{asyncHandler};