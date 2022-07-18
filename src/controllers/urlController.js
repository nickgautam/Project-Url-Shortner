const { model } = require("mongoose")
const urlModel = require("../models/urlModel")
const shortid = require('shortid')

const createUrl = async function(req,res){
    try{
        let data = req.body

        if(Object.keys(data).length==0){
            return res.status(400).send({
                status: false, 
                message: "Request body can't be empty"
            })
        }
        var urlPattern = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/
 
 
   if (!urlPattern.test(data.longUrl)){
    return res.status(400).send({status: false , message: "Url is invalid"})
   }
 
        let urlDecodedCode = shortid.generate()
        let shortDecodedUrl = "http://localhost:3000/"+urlDecodedCode
        data.shortUrl = shortDecodedUrl
        data['urlCode'] = urlDecodedCode
        let result = await urlModel.create(data)
        return res.status(201).send({status:true, data:result})
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }

}
   
const getUrl = async function(req,res){

  try { 
    let code = req.params.urlCode

    if(!shortid.isValid(code)){
        return res.status(400).send({status:false,msg:"Invalid Code"})
    }
    let getLongUrl = await urlModel.findOne({urlCode:code}).select({_id:0,longUrl:1})
    if(!getLongUrl){
        return res.status(404).send({status:false,message:"No Url Found"})
    }

     res.status(302).send("Redirect to " + getLongUrl.longUrl)
}
catch(err){
    return res.status(500).send({status:false,message:err.message})
}

}

module.exports = {createUrl,getUrl}