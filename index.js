const express=require('express');
const userModel=require('./model/userModel');
const connectDB=require('./db');
const userRoute=require('./routes/userRoute');
const path = require('path');
const bodyParser = require('body-parser');
const { getSignedUrl }=require("@aws-sdk/s3-request-presigner");
const app=express();
const { S3Client,PutObjectCommand,GetObjectCommand }=require('@aws-sdk/client-s3');
const  credentials={
    accessKeyId:"AKIAVODBZ54HEBE63TVR",
    secretAccessKey:"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"
 }
const s3=new S3Client({
 credentials,
 region:"eu-north-1"
});
const multer = require('multer');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(userRoute);
app.post('/upload', upload.single('croppedImage'), async(req, res) => {
    const file = req.file;
    const authorizationHeader = req.get('Authorization');// The uploaded file
    const userEmail = authorizationHeader.substring('Bearer '.length);
    console.log(file,userEmail);
    const params={
        Bucket:'kranhti1',
        Key:req.file.originalname,
        Body:req.file.buffer,
        ContentType:req.file.mimetype,
    }
     const command=new PutObjectCommand(params);
     const task=await s3.send(command);
     if(task){
      userModel.findOneAndUpdate(
         { email: userEmail },
         { $push: { images: req.file.originalname } },
         { new: true }
       )
         .then(updatedUser => {
           if (updatedUser) {
             console.log('User updated:', updatedUser);
           } else {
             console.log('User not found');
           }
         })
         .catch(error => {
           console.error('Error updating user:', error);
         });
     }
    // Process the file as needed
    // ...
    res.send('File received successfully');
  });
app.get('/galleryImgs', async (req, res) => {
   // Extract user email from middleware
   const authorizationHeader = req.get('Authorization');// The uploaded file
   const userEmail = authorizationHeader.substring('Bearer '.length);
    console.log(userEmail);
   if (!userEmail) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
 
   try {
     // Find user in the database based on the extracted email
     const user = await userModel.findOne({ email: userEmail });
     console.log(user);
     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }
     
     const imageUrls = await Promise.all(user.images.map(async (image) => {
      return await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: 'kranhti1',
          Key: image,
        }),
        { expiresIn: 60 } // Adjust as needed
      );
    }));
    res.json({ imageUrls });
   } catch (error) {
     console.error('Error retrieving user and generating URLs:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
app.use('/index',(req,res)=>{
   res.sendFile(path.join(__dirname, 'view', 'index/index.html'))
});
app.use('/gallery',(req,res)=>{
    res.sendFile(path.join(__dirname, 'view', 'gallery/gallery.html'))
 });
 app.use('/logIn',(req,res)=>{
    res.sendFile(path.join(__dirname, 'view', 'login/login.html'))
 })
 app.use('/signUp',(req,res)=>{
    res.sendFile(path.join(__dirname, 'view', 'signIn/signIn.html'))
 })
app.use('/',(req,res)=>{
   res.sendFile(path.join(__dirname, 'view', 'home/home.html'))
})

connectDB();
app.listen(5000,()=>{
    console.log('server listening to port number 5000')
})
