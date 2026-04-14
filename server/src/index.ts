import { server } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
   path: "./.env",
});
const PORT = Number(process.env.PORT) || 8000;

connectDB()
   .then(() => {
      server.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
      });
   })
   .catch((err) => {
      console.error("MongoDB connection failed !!", err);
      process.exit(1);
   });
