const {Router}=require("express");
const path=require("path");
const multer=require("multer");
const Blog=require("../models/blog");
const Comment=require("../models/comment");

const router=Router();

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.resolve(__dirname,`../public/uploads`))
  },
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`);
  },
})

const upload=multer({storage:storage});

router.get("/add-new",(req,res)=>{
  return res.render("addBlog",{user:req.user});
})

router.get("/:id",async (req,res)=>{
  const blog=await Blog.findById(req.params.id).populate('createdBy');
  const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
  res.render('viewblog',{user:req.user,blog,comments});
})

router.post("/comment/:blogId",async (req,res)=>{
  await Comment.create({
  content:req.body.content,
  blogId:req.params.blogId,
  createdBy:req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogId}`);
 })

router.post('/', upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!req.user) return res.status(401).send("User not logged in");
    if (!req.file) return res.status(400).send("File not uploaded");

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageUrl: `/uploads/${req.file.filename}`,
    });

    console.log("Blog created:", blog);
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports=router;