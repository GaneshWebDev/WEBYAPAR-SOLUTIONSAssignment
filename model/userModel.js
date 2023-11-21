const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    images:[]
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;