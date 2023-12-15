import mongoose from "mongoose";
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./routers/UserRouter";
import OrderRoute from "./routers/OrderRoute";
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
app.use(bodyParser.json())
app.use(express.json());
app.use(cors());

// you should put here your mongodb url 
const url = process.env.MONGO_URL!;
mongoose.set("strictQuery", true);
mongoose
    .connect(url)
    .then(() => console.log("ishladi"))
    .catch((error) => console.log("error bor"));

app.use("/user", UserRoute);
app.use("/order", OrderRoute);

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`bizning port ${PORT}da ishlamoqda`);
});
