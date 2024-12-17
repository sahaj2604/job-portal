import mongoose from "mongoose";

const connectDB=()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("connected with db")
        })
        .catch(()=>console.log('error in connection ',err.message));
    } catch (error) {
        console.log("connection with db failed",error.message);
    }
}

export default connectDB;