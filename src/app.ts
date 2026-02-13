import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes";
import postroutes from "./routes/post.routes";
import commentroutes from "./routes/comment.routes";


dotenv.config();

const app=express();

app.use(express.json());
app.use("/api/auth",authroutes);
app.use("/api/posts", postroutes);
app.use("/api/comment", commentroutes);

app.get("/", (req, res) => {
  res.send("Server is running ");
});

export default app;

