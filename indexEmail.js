require("dotenv").config()
const nodemailer = require("nodemailer")
// const http = require("http")
const express = require("express")
const crypto = require('crypto')
const regEx = require("./config/regEX")
const User = require("./model/UserSchema")
const connectDB = require("./db/dbconn")
const mongoose = require("mongoose")
const app = express()
// const server = http.createServer(app)
const code = crypto.randomBytes(3).toString('hex');

connectDB()

app.use(express.json())

const PORT = process.env.PORT || 3500

const sendEmail = (email, name, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS
        }
      });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Hi ${name}`,
        html: `<h1>This is your confirmation code ${code.toUpperCase()}</h1>
        <p>Support team</p>
        `
    }

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
             res.status(500).json({ error})
            // console.log(error);
        } else {
            const newUser = await User.create({ name, email })
            res.status(200).json({message: "Mail sent successfully"})
        }
    })
}

app.post("/", (req, res) => {
    const { recipientEmail, name } = req.body
    if (!recipientEmail || !name) {
        return res.status(400).json({msg: "Recipient email and name is required"})
    }
    const validEmail = regEx.test(recipientEmail)
    if (!validEmail) {
         res.status(400).json({msg: "Enter a valid email, If you're sure your mail is valid then try another one"})
    }
    sendEmail(recipientEmail, name, res)
})

mongoose.connection.once("open", () => {
  console.log("Connected to Database")
  app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
})


// app.listen(3000, () => {
//     console.log("Server started on port 3000")
// })

// sendEmail(recipientEmail, name)