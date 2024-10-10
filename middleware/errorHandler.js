const AppError = require("../AppError");
const { INVALID_SUBSCRIPTION } = require("../constants/errorCode");

const errorHandler=(error,req,res,next)=>{
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            code:error.errorCode,
            message:error.message
        })
    }//handle custom errors like this
    return res.status(500).json({success:false,message:"Something went wrong"});
}

module.exports=errorHandler