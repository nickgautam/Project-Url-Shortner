const urlModel = require("../models/urlModel")
const shortid = require('shortid')


const createUrl = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) { //[]===>{}
            return res.status(400).send({
                status: false,
                message: "Request body can't be empty"
            })
        }
        var urlPattern = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/
        if (!urlPattern.test(data.longUrl)) {
            return res.status(400).send({ status: false, message: "Url is invalid" })
        }


        let dbData = await urlModel.findOne({ longUrl: data.longUrl })
        if (dbData) {
            let dbData1 = {
                urlCode: dbData.urlCode,
                longUrl: dbData.longUrl,
                shortUrl: dbData.shortUrl
            }
            return res.status(201).send({ status: true, data: dbData1 })
        }


        let urlCode1 = shortid.generate().toLowerCase()
        let shortUrl1 = "http://localhost:3000/" + urlCode1
        data.shortUrl = shortUrl1
        data['urlCode'] = urlCode1
        let result = await urlModel.create(data)
        let res1 = {
            urlCode: result.urlCode,
            longUrl: result.longUrl,
            shortUrl: result.shortUrl
        }
        return res.status(201).send({ status: true, data: res1 })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode


        let getLongUrl = await urlModel.findOne({ urlCode: urlCode }).select({ _id: 0, longUrl: 1 })
        if (!getLongUrl) {
            return res.status(404).send({ status: false, message: "No data Found" })
        }
        return res.status(302).redirect(getLongUrl.longUrl)
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

module.exports = { createUrl, getUrl }