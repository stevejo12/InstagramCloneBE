import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';

// app config
const app = express();
const port = process.env.API_PORT || 8002;
dotenv.config();

// middleware
app.use(express.json())
app.use(cors())

// db config
const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// routes
app.get('/', (req,res) => {
  res.status(200).send("Hello World!")
})

app.use("/user", userRouter);


// listeners
app.listen(port, () => {
  console.log(`Instagram Clone ExpressJS is listening at http://localhost:${port}`)
})