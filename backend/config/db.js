//add function to connect with mongoDB database
import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/DentaCare`)
    } catch (error) {
        console.error("Database connection failed", error)
    }
}
export default connectDB;