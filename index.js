const express = require('express')
const app = express()
const mongoose = require('mongoose')
//Import Routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')

mongoose.connect('mongodb://127.0.0.1:27018/authorization',{useNewUrlParser: true,useUnifiedTopology: true})

const connection = mongoose.connection

connection.once('open',function(){
    console.log("MongoDB connection established successfully")
})

//Middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json())

//Route Middleware
app.use('/api/use',authRoute)
app.use('/api/posts',postRoute)

app.listen(3000,()=>console.log("App is running"))
