const express=require("express");
const bodyParser=require("body-parser")
const path=require("path")
const app=express()
const hbs=require("hbs")
const multer=require("multer")
const fs=require("fs")
require("../mongo/conn");
const Submit=require("../models/submit")
const Register=require("../log-register/log-register/src/models/registers");
const port=process.env.PORT||5000;

const staticPath=path.join(__dirname,"../public")
const templatePath=path.join(__dirname,"../templates/views")
const partialsPath=path.join(__dirname,"../templates/partials")


app.use(bodyParser.urlencoded({extended:true}))

var storage=multer.diskStorage({
    destination:function(req,file,cb){
     cb(null,'log-register\\log-register\\public\\images')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
    }
})

var upload=multer({storage:storage})

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(staticPath))
app.set("view engine","hbs")
app.set("views",templatePath);
hbs.registerPartials(partialsPath)
app.get("/Article_Submit",(req,res)=>
{
res.render("Author_Article_submit")
  //  res.send("server created")

})


app.get("/show",(req,res)=>{
     Submit.find({},function(e,blogs){
    res.render("show",{"list":blogs})
})

})


app.post("/Article_Submit",upload.single('File'),async (req,res)=>{
    try{
 console.log(req.file);
    var img=fs.readFileSync(req.file.path);
    const encode_image=img.toString('base64');
    var finalImg={
        content_Type:req.file.mimetype,
        path:req.file.path,
        
    }

  const str= finalImg.path;
  const newstr=str.substr(32)
  console.log(newstr);
     const submission=new Submit({
         Name:req.body.Name,
         Qualification:req.body.Qualification,
         Topic:req.body.Topic,
         Event_location:req.body.Event_location,
         Article:req.body.Article,
        File:newstr,

     })
     console.log(finalImg.path);
     const Submitted=await submission.save();
    
     res.render("Author_Article_submit")
    }catch(err){
     res.status(400).send(error)
    }

})

const newstaticPath=path.join(__dirname,"../log-register/log-register/public")

const newtemplatePath=path.join(__dirname,"../log-register/log-register/templates/views")
const new_partialsPath=path.join(__dirname,"../log-register/log-register/templates/partials")

app.use(express.static(newstaticPath))
app.set("view engine","hbs")
app.set("views",newtemplatePath);
hbs.registerPartials(new_partialsPath)

app.get("/",(req,res)=>{
    res.render("index");
});





app.get("/events",(req,res)=>{
    Submit.find({},function(e,blogs){
   res.render("events",{"list":blogs})
})
})








///////////////////////////////////////////
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/afterlogin",(req,res)=>{
    res.render("afterlogin");
});

app.get("/*",(req,res)=>{
    res.render("error");
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
     res.status(201).render("login");
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
       res.status(201).render("Author_Article_submit");
   }
   else{
       res.send("Invalid login details");
   }

 }
 catch(error){
     res.status(400).send("Invalid login details");
 }


})

//////////////////////////////////////////



app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})
