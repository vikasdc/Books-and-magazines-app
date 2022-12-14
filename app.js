// import express from "express"
// import bodyparser from "body-parser"
// import bm from "./routes/bm.js"

const express = require("express")
const bodyparser = require("body-parser")
const bm = require("./routes/bm")
const port = process.env.PORT || 80

const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyparser.urlencoded({extended:false}))

app.use(bm)


app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})