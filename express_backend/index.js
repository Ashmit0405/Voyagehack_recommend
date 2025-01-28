import dotenv from "dotenv"
import connectDB from "./db.js";
import { app } from "./app.js";
import router from "./routes/h.route.js";
dotenv.config({
    path: '../.env'
})
const port=process.env.PORT||3000
connectDB()
.then(()=>{

    app.use('/api/v1',router);
    app.listen(port,()=>{
        console.log(`listening at ${port}`);
    })
})
.catch((error)=>{
    console.log("Connection error: ",error);
})
router