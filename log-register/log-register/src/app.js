const express=require("express");
const path=require('path');
const app = express();
const hbs=require('hbs');
require("./db/conn");
const Register=require("./models/registers");
const{json, response} = require("express");
const port=process.env.PORT || 5000;
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);
app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/afterlogin",(req,res)=>{
    res.render("afterlogin");
});
app.get("/events",(req,res)=>{
    res.render("events");
});



app.post("/register", async (req,res)=>{
  try{
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
   if(password===cpassword){
      const registerEmployee = new Register({
        fullname:req.body.fullname,
        email:req.body.email,
        gender:req.body.gender,
        phone:req.body.phone,
        
        password:password,
        confirmPassword:cpassword
     })
     const registered= await registerEmployee.save();
     res.status(201).render("events");
   } 
   else{
       res.send("password are not matching");
   } 
}
  catch(error){
      res.status(400).send(error);
  }
});

app.post("/login", async (req,res)=>{
 try{
   const email=req.body.email;
   const password=req.body.password;
   const useremail= await Register.findOne({email:email});
   if(useremail.password===password){
       res.status(201).render("events");
   }
   else{
       res.send("Invalid login details");
   }

 }
 catch(error){
     res.status(400).send("Invalid login details");
 }


})

app.listen(port,()=>{
    console.log(`server is running in port number ${port}`);
});
