const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(res, req) {
    const firstName = res.body.fName
    const lastName = res.body.lName
    const email = res.body.email

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const JSONdata = JSON.stringify(data)

    const url = "https://us19.api.mailchimp.com/3.0/lists/99b073d2d9"
    const options = {
        method: "POST",
        auth: "nazeeh1:afa4b61da71212069b08bbd5cdb982a2b-us19"
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            console.log(response.statusCode)

            if(response.statusCode === 200) {
                req.sendFile(__dirname + "/success.html")
            } else {
                req.sendFile(__dirname + "/failure.html")
            }
        })
    })

    request.write(JSONdata)
    request.end()
})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started at port 3000")
})

// API key
// fa4b61da71212069b08bbd5cdb982a2b-us19

// List ID
// 99b073d2d9