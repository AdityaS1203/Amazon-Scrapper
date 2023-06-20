const express=require("express");
const configureBrowser=require("./configBrowser");
const bodyParser=require("body-parser");
const PORT=3001||process.env.PORT;
const app=express();
const path = require('path');
const puppeteer=require('puppeteer')
const cheerio=require('cheerio')
const sendMail=require('./services/sendEmail')
require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join("public")));
app.set("view engine","ejs");

const mongoose= require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL);
const taskSch=new mongoose.Schema({
  name:String,
  pricing:String,
  alias:String
});
const item=mongoose.model("item",taskSch);



app.get("/", async function(req, res) {
  const kaamKiList = await item.find()
  .catch(err => {
    console.log(err);
  });

  const linkArr = [];
  const priceArr=[];
  const currpriceArr=[];
  const aliasArr=[];
  for (let i = 0; i < kaamKiList.length; i++) {
    linkArr.push(kaamKiList[i].name);
    priceArr.push(kaamKiList[i].pricing);
    aliasArr.push(kaamKiList[i].alias);
    const html = await configureBrowser(kaamKiList[i].name);
    const $ = cheerio.load(html);
    const element = $('.a-price-whole', 'span').eq(0);
    let price=element.text();
    
    let val = "";
    for (let i = 0; i < price.length; i++) {
      if (price[i] !== "," && price[i] !== ".") {
        val = val + price[i];
      }
    }
    price = parseInt(val);
    currpriceArr.push(price);
    if(price<=priceArr[i]){
      sendMail(
        `<h1>Buy the product using the link below</h1>${linkArr[i]}`
      )
    }
  }

  res.render("list", { newlistitem: linkArr, newpriceitem:priceArr,currPrice:currpriceArr,aliasName:aliasArr});
});

app.post("/",function(req,res){
  var entered=req.body.link
  var priceEntered=req.body.price
  var aliasName=req.body.alias;
  const taskItem=new item({
    name:entered,
    pricing:priceEntered,
    alias:aliasName
  });
  if(entered.trim().length!==0){
    taskItem.save()
  }
  res.redirect("/")
})

app.get("/delete",function(req,res){
  const a=item.find()
    .then(kaamKiList=>{
      const linkArr=[];
      for(var i=0;i<kaamKiList.length;i++){
        linkArr.push(kaamKiList[i].name)
      }
      res.render("list",{newlistitem:a});
    })
    .catch(err=>{
      console.log(err);
    })
});

app.post("/delete",function(req,res){
  const btnNo=req.body.btn;
  item.find()
    .then(kaamKiList=>{
      const a=[];
      for(var i=0;i<kaamKiList.length;i++){
        a.push(kaamKiList[i].name)
      }
      var naam=a[btnNo];
      item.deleteOne({name:naam})
        .then(()=>{
          res.redirect("/");
        })
        .catch(err=>{
          console.log(err);
        })
    
  })
    .catch(err=>{
      console.log(err);
    });
    
});


app.listen(PORT,function(){
    console.log("server for amazonLink is running");
});
