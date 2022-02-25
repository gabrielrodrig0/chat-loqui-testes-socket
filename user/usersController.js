const express = require("express");
const users = require("../database/users");
const rooms = require("../database/rooms");
const usersInRooms = require("../database/usersInRoom");
const router = express.Router();
const bcrypt = require("bcrypt");


//Login
router.get("/", (req,res)=>{
    res.render("login");
})

router.post("/authenticate", (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;

    users.findOne({where:{username:username}}).then(user=>{

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
                        username:username,
                        rms:rms
                    })


                })



                //res.json(req.session.user);
            }
            else {
                res.redirect("/");
            }
        }
        else {
            res.redirect("/");
        }
    })
})

//Register

router.get("/register", (req,res)=>{
    res.render("register");
})


router.post("/register", (req,res)=>{

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    
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

    let roomName = req.body.roomName;
    let limit = req.body.limit;
  
    rooms.findOne({where:{roomName:roomName}}).then(room =>{
  
      if(room != undefined){
        console.log("SALA JÁ EXISTE NÃO É POSSIVEL CRIAR ")
      } else{
        rooms.create({   
          roomName:roomName,
          limit:limit
        }).then(()=>{
          console.log("ROOM CRIADA COM SUCESSO");
          
        })
      }
    })
});

router.post("/selectedroom", (req,res)=>{

    let roomName = req.body.select_room;
    let userName = req.body.userName;
    

    console.log("roomName: "+roomName)
    console.log("userName: "+userName)
    
    res.send("roomName: "+roomName+ "  userName: "+userName)

})

router.get("/room", (req,res)=>{

    rooms.findAll({raw:true}).then(rooms =>{

        res.render("room")
    });
});





module.exports = router;