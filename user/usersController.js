const express = require("express");
const users = require("../database/users");
const rooms = require("../database/rooms");
const router = express.Router();
const bcrypt = require("bcrypt");


//Login
router.get("/", (req,res)=>{
    res.render("login");
})

router.post("/authenticate", (req,res)=>{
    const userName = req.body.userName;
    const password = req.body.password;

    users.findOne({where:{username:userName}}).then(user=>{

        if(user!=undefined){
            //password validate
            let correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id:user.id,
                    user:user.username,
                }
                
                rooms.findAll({raw:true}).then(rms =>{
                    
                    res.render("room",{
                        userName:userName,
                        rms:rms
                    })
                })
                //res.json(req.session.user);
            }
            else {
                res.redirect("/");
            }
        }else {
            res.redirect("/");
        }
    })
})

//Register

router.get("/register", (req,res)=>{
    res.render("register");
})


router.post("/register", (req,res)=>{

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    //Verificando se já tem usernames e emails no banco de dados!

    users.findOne({where:{email:email}}).then(user=>{
        if(user==undefined){

            users.findOne({where:{username:username}}).then(user=>{

                if(user==undefined){
                    users.findOne({where:{username:username}}).then(user=>{
                    
                        let salt = bcrypt.genSaltSync(10);
                        let hash = bcrypt.hashSync(password,salt);
            
                        users.create({
                            username:username,
                            email:email,
                            password:hash,
            
                        }).then(()=>{
                            console.log("Usuário cadastrado!"
                            )})
                            res.render("accountCreated", {
                            username:username
                            });
                        })
                }
                else{
                    res.redirect("/register");
                }
            })
        }

        else {
            res.redirect("/register");
        }

    });
    
});

//logout

router.get("/logout", (req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
});

//room 

router.post("/createRoom", (req,res)=>{
    //mudança realizada aqui
    const roomName = req.body.roomName;
    const limit = req.body.limit;
  
    rooms.findOne({where:{roomName:roomName}}).then(room =>{
  
      if(room != undefined){
        res.send("<h1>Room já existe<h1>")
      } else{
        rooms.create({   
          roomName:roomName,
          limit:limit
        }).then(()=>{
          res.send("<h1>Created Room<h1>")
        })
      }
    })
});

router.post("/selectedroom", (req,res)=>{

    const userName = req.body.userName;
    const roomName = req.body.select_room;

    //console.log("userName: "+userName+" || roomName: "+roomName);

    res.render("main",{
        userName:userName,
        roomName:roomName
  })

})

router.get("/room", (req,res)=>{

    console.log("Room: "+rms+" || username: "+userName)
    
    rooms.findAll({raw:true}).then(rooms =>{
        res.render("room");
    });
});




module.exports = router;