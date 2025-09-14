const bcrypt=require("bcrypt"); 
const {Schema,model}=require("mongoose");
const{createTokenForUser}=require("../services/authentication")


const userSchema=new Schema({
  fullName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  profileImageUrl:{
    type:String,
    default:"/images/default.png"
  },
  role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER"
  }
},{timestamps:true})

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) 
    {
      return next();
    }
    const saltRounds = 12;                 
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.statics.verifyPasswordAndGenerateToken = async function (email, plainPassword) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found"); 
  }

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }
  const token = createTokenForUser(user);
  return token;
};


const User=model("User",userSchema);
module.exports=User;