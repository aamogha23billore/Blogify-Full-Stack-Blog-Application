const jwt=require("jsonwebtoken");
const secret="ShaanMaan23";

function createTokenForUser(user){

  return jwt.sign({
    _id:user._id,
    email:user.email,
    fullName: user.fullName,   
    profileImageUrl:user.profileImageUrl,
    role:user.role
  },secret);
}

function validateToken(token){
  const payload=jwt.verify(token,secret);
  return payload;
}

module.exports={
  createTokenForUser,
  validateToken,
}