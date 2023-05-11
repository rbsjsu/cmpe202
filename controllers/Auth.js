const userModel = require("../models/User");


exports.login = async(req, res)=>{
    let {email_id, password} = req.body;

    userModel.findOne({email_id})
    .then(user=>{
        if(user){
            if(user.password=== password){
                res.send({user_id:user._id, name:user.name, role:user.role});
            }else{
                res.send({error:"Wrong Password !"});
            }
        }else{
            res.send({error:"User Not found !"});
        }
    })
}