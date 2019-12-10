const express = require ('express'); 
const router = express.Router(); 
const User = require ('../models/user.js')
const bcrypt = require ('bcrypt'); 
const saltRounds = 10; 
const salt = bcrypt.genSalt(saltRounds); 
const bcryptSalt = 10; 

router.get("/signup", (req,res,next)=>{
    res.render ("auth/signup"); 
}); 

router.post("/signup", (req,res, next)=>{
    const username = req.body.username; 
    const password = req.body.password; 
    if (username === "" || password === ""){
        res.render('auth/signup', {
        errorMessage : "Veuillez completer"
        })
        return; 
    }
    User.findOne({username:username})
        .then (user =>{
            if (user){
                res.render ("auth/signup",{
                    errorMessage : "User already taken"
                });
                return;
            }
        })
        const salt     = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({
            username:username,
            password:hashPass
        })
        .then(user=>{
            res.redirect("/index")
        })
        .catch(error=>{
            next(error)
        })

})

module.exports = router; 