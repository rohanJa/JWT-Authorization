const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValdiation} = require('./validation')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

/*
    async and await are used as object
    take time to get saved in the database
*/

router.post('/register',async (req,res)=>{
    
    //LETS VALIDATE THE DATA BEFORE WE MAKE A USER
    
    const {error} = registerValidation(req.body)
    
    if(error)
        return res.status(400).send(error.details[0].message)
        
    //check if the user already exsist in the database

    const emailExsist = await User.findOne({email:req.body.email})

    if(emailExsist) return res.status(400).send("Email already exsist")

    //Hash passwords using bcrypt

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt)

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }
    catch(err){
        res.status(400).send(err)
    }

});


router.post('/login',async (req ,res)=>{

    // Data validation

    const {error} = loginValdiation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    /* Check if email is authentic as loginValidation function
       check if syntax is correct
    */

    const user = await User.findOne({email:req.body.email})
   
    /* '!' is used as it checks if the corresponding email 
        is correct or not as "loginValidation" check if format
        of email and password is correct
    */

    if(!user) return res.status(400).send("Email is wrong");

    //password is correct or not
    
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    
    if(!validPassword) return res.status(400).send("Password is wrong");
    
    //create and assign a token
    
    const token =jwt.sign({_id:user._id}, "rohan")

    res.header('auth-token',token).send(token);
});


module.exports = router;