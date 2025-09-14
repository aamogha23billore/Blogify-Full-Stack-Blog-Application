require("dotenv").config();

const express=require("express");
const path=require("path");
const app=express();
const PORT=process.env.PORT||8002;
const userRoute=require("./routes/user");
const blogRoute=require("./routes/blog");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog=require("./models/blog");

mongoose.connect(process.env.MONGO_URL).then((e)=>{console.log("MongoDB connected")});

app.set("view engine","ejs");
app.set("views",path.resolve(__dirname,"views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/user",userRoute);
app.use("/blog",blogRoute);
 
app.get("/",async (req,res)=>{
   const allBlogs=await Blog.find({})
   if (!req.user) return res.redirect("/user/signin");
   
  res.render("home", { user: req.user,blogs:allBlogs }); 
})

app.listen(PORT,()=>{console.log("Server started at PORT",PORT)});  