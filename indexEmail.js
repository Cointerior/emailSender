require("dotenv").config()
const nodemailer = require("nodemailer")
const http = require("http")
const express = require("express")
const crypto = require('crypto')
const app = express()
const server = http.createServer(app)
let code = crypto.randomBytes(10).toString('hex');
server.listen(3000, () => {
    console.log("Server started on port 3000")
})


app.use(express.json())



const sendEmail = (email, name) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Hi ${name}`,
        html: `<h1>This is your confirmation code ${code}</h1>
        <p>Support team</p>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json({message: "Mail sent successfully"})
        }
    })
}

// app.post("/", (req, res) => {
//     const { email, name } = req.body
//     if (!email || !name) {
//         res.status(400).json({error: "Email and password is required"})
//     }
//     sendEmail(email, name)
// })

sendEmail("cointerior15@gmail.com", "dre")