const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));

const username=process.env.user;
const password=process.env.password;
mongoose.connect("mongodb+srv://"+username+":"+password+"@cluster0.9symy.mongodb.net/BankDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
    sno : Number, 
    name:String,
    email:String,
    balance:Number
}
const Customer = mongoose.model("Customer",userSchema);
//dummy data
const customer1 = new Customer({
    sno : 1,
    name : "Atul Kumar",
    email : "atul123@gmail.com",
    balance : 100000
});
const customer2 = new Customer({
    sno : 2,
    name : "Ankit Kumar",
    email : "ankit123@gmail.com",
    balance : 20000
});
const customer3 = new Customer({
    sno : 3,
    name : "Amber Kumar",
    email : "amber123@gmail.com",
    balance : 30004
});
const customer4 = new Customer({
    sno : 4,
    name : "Ayush Kumar",
    email : "ayush123@gmail.com",
    balance : 40000
});
const customer5 = new Customer({
    sno : 5,
    name : "Yash Kumar",
    email : "yash123@gmail.com",
    balance : 50000
});
const customer6 = new Customer({
    sno : 6,
    name : "Nitish Kumar",
    email : "nitish123@gmail.com",
    balance : 22000
});
const customer7 = new Customer({
    sno : 7,
    name : "Aditya Kumar",
    email : "Aditya123@gmail.com",
    balance : 3000
});
const customer8 = new Customer({
    sno : 8,
    name : "Aniket Kumar",
    email : "aniket123@gmail.com",
    balance : 50000
});
const customer9 = new Customer({
    sno : 9,
    name : "Rishab Kumar",
    email : "rishab123@gmail.com",
    balance : 50
});
const customer10 = new Customer({
    sno : 10,
    name : "Manik Kumar",
    email : "manik123@gmail.com",
    balance : 500000
});

const transactionSchema = {
    sender : String,
    recipient : String,
    amount : Number,
    status : String
} 
const Transaction = mongoose.model("Transaction",transactionSchema);

const dummyCustomer = [customer1,customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10];
app.get("/",function(req,res){
    res.render("home");
});
app.get("/customer",function(req,res){
    Customer.find({},function(err,foundCustomer){
        if(!err){
            if(foundCustomer==0){
                Customer.insertMany(dummyCustomer,function(err){
                    if(!err){
                        console.log("Customer added successfully");
                    };
                });
            }else{
              res.render("customer",{customer:foundCustomer});      
            }
        }
    })
});
app.get("/transfer",function(req,res){
    res.render("transfer");
});
app.post("/transfer",function(req,res){
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const amount =Number(req.body.amount);
    var flag="0";
    Customer.findOne({email:sender},function(err,foundSender){
        if(!err){
            if(!foundSender){
                console.log("sender mail is wrong");
                flag="1";
            }else{
                console.log("sender found");
                let newBalance = foundSender.balance-amount;
                if(newBalance>0){
                    console.log(newBalance);
                    foundSender.updateOne({balance:newBalance},function(err,done){
                        if(!err){
                            console.log("sender updatation successs");
                        }
                    });
                }else{
                    flag="1";
                }
            }
        }
    });
    Customer.findOne({email:recipient},function(err,foundRecipient){
        if(!err){
            if(!foundRecipient || flag=="1"){
                console.log("reciver mail wrong");
                flag = "1";
            }else{
                let newBalance = Number(foundRecipient.balance+amount);
                foundRecipient.updateOne({balance:newBalance},function(err,done){
                    if(!err){
                        console.log("recipient Successfull");
                    }
                });  
            }
            console.log(flag);
            if(flag== "1"){
                const transaction = new Transaction({
                    sender : sender,
                    recipient: recipient,
                    amount : amount,
                    status : "Failed"
                }); 
                transaction.save();
            }else{
                const transaction = new Transaction({
                    sender : sender,
                    recipient: recipient,
                    amount : amount,
                    status : "Successful"
            });
            transaction.save();
            }
        }
    });
    res.redirect("/transaction"); 
});
app.get("/account-:username",function(req,res){
    const customername= req.params.username;
    Customer.findOne({name:customername},function(err,found){
        if(!err){
            if(!found){

            }else{
                res.render("account",{user:found});
            }
        }
    });
});
app.get("/transaction",function(req,res){
    
    Transaction.find({},function(err,found){
        if(!err){
            if(!found){
                res.render("transaction",{transaction:""});
            }else{
                res.render("transaction",{transaction:found});
            }
        }
    })
});
app.get("/contact",function(req,res){
    res.render("contact");
});
let port = process.env.PORT;
if(port == null || ""){
    port = 3000
};
app.listen(port,function(){
    console.log("Server Started at port"+port);
})