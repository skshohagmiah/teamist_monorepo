import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    profilePicture: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


export const User = mongoose.model("User", userSchema)