const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const productShema = mongoose.Schema({
      name:{
        type:String,
        require:true
      },
      image:{
        type:String,
        require:true
      },
      price:{
        type:Number,
        require:true
      },


    
    // tokens:[{
    //     token:{
    //         type:String,
    //         require:true
    //     }
    // }]

})

//generating token
// productShema.methods.generateAuthtoken = async function(){
//      try {
//          console.log(this._id)
//          const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
//          this.tokens = this.tokens.concat({token:token})
//          await this.save();
//          return token;
//      } catch (error) {
//          res.send("the part error" + error)
//          console.log("


//     if(this.isModified("password")){
//         // const passwordHash = await bcrypt.hash(password,10);
      
//         this.password = await bcrypt.hash(this.password,10);
      
//         this.confirmpassword = await bcrypt.hash(this.password,10);
//     }
  
//     next();
// })
//now we need to  create a collection

const product = new mongoose.model("product",productShema)
module.exports = product;