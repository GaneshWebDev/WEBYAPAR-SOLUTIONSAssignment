const mongoose=require('mongoose');
async function connectDB(){
      try {
        const db=await mongoose.connect('mongodb+srv://Flipkart_clone:Flipkart_clone@cluster0.ltdjk8f.mongodb.net/editUser?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          console.log('DB connected');

      } catch (error) {
        console.log(error);
      }
}
module.exports=connectDB;


    
