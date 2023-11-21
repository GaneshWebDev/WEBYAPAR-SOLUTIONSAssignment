const express=require('express');
const userModel=require('../model/userModel');
const bcrypt = require('bcrypt');
const { redirect } = require('react-router-dom');
const router=express.Router();
router.post('/signInSubmit',async(req,res)=>{
    try {
        const {firstName,lastName,email,password}=req.body;
        console.log(req.body);
        const newUser=new userModel({firstName,lastName,email,password});
        await newUser.save();
        res.status(201);
        res.redirect('/login');    
    } catch (error) {
        res.status(500).json({error:"error creating user"});
    }
});
router.post('/loginSubmit',async(req,res)=>{
    const {email,password}=req.body;
  try {
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful',userData:user });
    } else {
      res.status(401).json({ message: 'Incorrect username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports=router;