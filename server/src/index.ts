import { app } from './app.js';
import connectDB from './db/index.js';
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})
connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`); 
    })
})
.catch((err) => {
    console.log("MongoDB conncetion failed !!")
})