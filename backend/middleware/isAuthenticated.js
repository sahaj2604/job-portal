import jwt from "jsonwebtoken";

const isAuthenticated=async (req,res,next) => {
    try {
        const token=req.cookies.authToken;
        if(!token){
            return res.status(401).json({message:"user not authenticated",success:false});
        }
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({message:"invalid token",success:false});
        }
        req.id=decode.userId;
        next();
    } catch (error) {
        console.log('problem in isAuthenticated',error)
    }
}
export default isAuthenticated;