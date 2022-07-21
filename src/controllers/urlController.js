const mongoose = require("mongoose")
const urlModel = require("../models/urlModel")
const shortid = require('shortid')
const redis = require("redis")
const{promisify} = require('util')

const redisClient = redis.createClient(
    14466,
    "redis-14466.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    {no_ready_check:true}
);
redisClient.auth("v9SR3Gkk4N0vCW1Yk8XWfyeQFk2LYcfp",function(err){
    if(err)throw err
});

redisClient.on("connect",async function(){
    console.log("Redis Is connected")
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)

const createUrl = async function(req,res){
    try{
        let data = req.body

        if(Object.keys(data).length==0){
            return res.status(400).send({
                status: false, 
                message: "Request body can't be empty"
            })
        }
       let urlPattern = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/

   if (!urlPattern.test(data.longUrl)){
    return res.status(400).send({status: false , message: "Url is invalid"})
   }


        let urlDecodedCode = shortid.generate().toLowerCase()
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
try{
        let urlCode = req.params.urlCode
        let cacheData = await GET_ASYNC(`${urlCode}`)
        console.log(cacheData)
        if(cacheData){
            res.status(302).redirect(cacheData)
        }
        else{
        let getLongUrl = await urlModel.findOne({urlCode:urlCode}).select({_id:0,longUrl:1})
        if(!getLongUrl){
            return res.status(404).send({status:false,message:"No data Found"})
        }
        await SET_ASYNC(`${urlCode}`, getLongUrl.longUrl)
         res.status(302).redirect( getLongUrl.longUrl)
    }
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})

    }
}

module.exports = {createUrl,getUrl}