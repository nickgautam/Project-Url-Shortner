const express = require('express');
const router = express.Router();
const urlController = require("../controllers/urlController");

router.post("/url/shorten",urlController.createUrl);
router.get("/:urlCode",urlController.getUrl)


router.all("/****",function(req,res){
    return res.status(404).send({status:false,msg:"Url that you are requesting is not available"})
})


module.exports = router;
