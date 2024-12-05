import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import authRouter from './routes/authRoute.js'

const PORT = process.env.PORT || 3002;
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (error) {
        console.log('DB connect error', error)
    }
}

connectDB();



app.use('/auth', authRouter);





app.listen(PORT, () => console.log("auth server is running on port :", PORT));



