require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const cors = require('cors');
const hbs = require("hbs")
const bcrypt = require("bcryptjs")
const product = require("./models/product")
const port = process.env.PORT ||10000
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")
require("./db/conn")
const Register = require("./models/registers")
const static_path = path.join(__dirname,"../public")
const tempalete_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
app.use(cors());
app.use(cors({
    origin:"http://localhost:3001",
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path ))
app.set("view engine","hbs")
app.set("views",tempalete_path)
hbs.registerPartials(partials_path)

// console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    
    res.render("Regstration")
})

app.get("/home",auth,(req,res)=>{
  
    console.log(req.user);
    let user = req.user;
    res.render("index",{user});
})
app.get("/secret",auth,(req,res)=>{
    // console.log(`this is cookies : ${req.cookies.jwt}`);
    res.render("secret")
})

app.get("/logout",auth, async (req,res)=>{
    // console.log(req.cookies.jwt);
   try {
        console.log(req.user)
        
        // for single logout

        // req.user.tokens = req.user.tokens.filter((currElem)=>{
        //       return currElem.token !== req.token;
        // })

        //logout form all devices
        req.user.tokens = []; 

       res.clearCookie("jwt");
       console.log("logout successfull");
       await req.user.save();
       res.render("login")
   } catch (error) {
       res.status(500).send(error);
   }
})

app.post("/product",async(req,res)=>{
 try{
    const user = new product(req.body)
    const createUser = await user.save();
    res.status(201).send(createUser);
    res.render("product")

 }catch (e){
    res.status(400).send(e);

 }
})
app.get("/product",async(req,res)=>{
    const productData= await product.find();
  res.json(productData)
   // console.log("the page part" + productData);
 res.render("product") 
})


app.get("/Regstration",async(req,res)=>{
    const registerData = await Register.find()
    res.json(registerData)
    // console.log(registerData)
    
    res.render("Regstration")
    
})

app.get("/login",(req,res)=>{
    res.render("login")
})

//create a new user in our database
app.post("/Regstration",async (req,res)=>{
   try {
         
          const password = req.body.password;
          const cpassword = req.body.confirmpassword;

          if(password === cpassword ){
             const registeremp = new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                phone:req.body.phone,
                age:req.body.age,
                email:req.body.email,
                password:password,
                confirmpassword:cpassword,
                gender:req.body.gender,      
             })
           
             console.log("the success part" + registeremp);
              
             const token = await registeremp.generateAuthtoken(); 
             console.log("the token part" + token);
             
            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 600000),
                httpOnly:true
            });
     

             const registered = await registeremp.save();
             console.log("the page part" + registered);
          
             res.status(201).render("index")
          }else{
              res.send("password are not match")
          }

   } catch (error) {
       res.status(400).send(error)
       
   }
})

//login check

app.post("/login",async(req,res)=>{
   try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({email:email})

    const isMatch = await bcrypt.compare(password,useremail.password);
    
    const token = await useremail.generateAuthtoken(); 
    console.log("the token part " + token);
    
    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 600000),
        httpOnly:true,
        // secure:true
    });

       if(isMatch){
   
        res.status(201).render("index")
 
    }else{
        res.send("Invalid Login Details")
    }
   } catch (error) {
    res.status(400).send("Invalid Login Details")
       
   }
})

const jwt = require("jsonwebtoken")

const createToken = async () =>{
    console.log(process.env.SECRET_KEY)
   const token = await jwt.sign({_id:"6305a65642d4eaf6cfdb9d12"},process.env.SECRET_KEY,{
       expiresIn:"2 second"
   });
//    console.log(token)

 const userVer = await jwt.verify(token,process.env.SECRET_KEY)
//    console.log(userVer)
}
createToken()

app.listen(port,() =>{
    console.log(`connection is live port no. ${port}`)
})