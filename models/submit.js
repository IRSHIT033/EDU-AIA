const mongoose=require("mongoose");
const mongoosePaginate=require("mongoose-paginate")
const AuthorSchema=new mongoose.Schema({
    Name:String,
    Article:String,
    Qualification:String,
    Topic:String,
    Event_location:String, 
    File:String,
    Date:{
        type: Date,
        default: Date.now,  
    }

})
const Submit=new mongoose.model("Submission",AuthorSchema);
module.exports=Submit;
