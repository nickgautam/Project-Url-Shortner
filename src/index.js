const  express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const route = require("./routes/route.js")
const app = express()

app.use(bodyparser.json())


const url = "mongodb+srv://MohdFarhan9990:LxP62162nUtlmSsp@cluster0.1zhmxfg.mongodb.net/myDatabase"
mongoose.connect(url,{useNewURLParser:true})
    .then(()=>console.log("MongoDB is Connected"))
    .catch(err=>console.log(err))

app.use('/',route)

app.listen(process.env.PORT ||3000,function(){
    console.log("Express App Running on Port"+(process.env.PORT ||3000))
})
    