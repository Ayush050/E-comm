
const express = require('express');  
const cors=require('cors');
require('./db/config');       // this is used to just connect to the database    
const User=require('./db/User');  // it is used to import the user schema from the database
const Product=require('./db/Product');  // it is used to import the product schema from the database
const app=express(); 
app.use(express.json());      // this is used to convert the data into json format so that we can use it in the backend
app.use(cors());   // this is used to connect the frontend and backend

app.post('/register', async (req,resp)=>{
      const user=new User(req.body);  // this is used to create a new user
      let result=await user.save();  // this is uded to save the user in the database 
      result=result.toObject();
      delete result.password;
      resp.send(result);
});  

app.post('/login', async (req,resp)=>{   
       if(req.body.email && req.body.password) {  // this is used to check the email and password is present or not
            let data=await User.findOne(req.body).select("-password");      // this is used to find the user in the database 
            if(data){  
                  resp.send(data);
            } 
            else {
                   resp.send("user not found")
            }
       } 
       else {
            resp.send("user not found")
       }
}); 


app.post('/add-product', async (req,resp)=>{ 
      let product=new Product(req.body);  // this is used to create a new product 
      let result=await product.save();  // this is used to save the product in the database 
      resp.send(result);
}); 

app.get('/products',async(req,resp)=>{ 
     let result=await Product.find();  // this is used to find the product in the database 
     if(result.length>0){
      resp.send(result);
     } 
     else {
      resp.send({message:"no product found"});
     }
}); 


app.delete('/product/:id',async(req,resp)=>{  
      let result=await Product.deleteOne({_id:req.params.id});  // this is used to delete the product from the database 
      resp.send(result);
      
}); 


app.get("/product/:id", async (req, resp) => {
      let result = await Product.findOne({ _id: req.params.id })
      if (result) {
          resp.send(result)
      } else {
          resp.send({ "result": "No Record Found." })
      }
  }) 


  app.put('/product/:id', async (req,resp)=>{
      let result=await Product.updateOne(
            {_id:req.params.id}, 

            {$set:req.body}
            
            )  // this is used to update the product in the database  

            resp.send(result);
    
  }); 

  app.get("/search/:key", async (req, resp) => {
      let result = await Product.find({
          "$or": [
              { name: { $regex: req.params.key } }, 
              { price: { $regex: req.params.key } }, 
              { category: { $regex: req.params.key } }, 
              { company: { $regex: req.params.key } }
          ]
      });
      resp.send(result);
  })

app.listen(5000);