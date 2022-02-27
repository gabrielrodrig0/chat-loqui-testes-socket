const express = require("express");
const users = require("../database/users");
const rooms = require("../database/rooms");
const router = express.Router();
const bcrypt = require("bcrypt");

let aux;

/*
let username;
let roomname;

function preenUser(un) {
    username = un;
}
function preenRoom(rm){
    roomname = rm;
}*/




function allRooms(res,username){

    const rm=rooms.findAll({raw:true}) 

    rm.then(rms =>{
        res.render("room",{
            username:username,
            rms:rms
        })
    })

    /* Se liga que interessante, pelo menos para mim...
    ISSO AQUI..
    const caramba=rooms.findAll({raw:true}) 

    caramba.then(rms =>{
        res.render("room",{
            username:username,
            rms:rms
        })
    É A MESMA COISA QUE ISSO AQUI

    rooms.findAll({raw:true}).then(rms =>{
        res.render("room",{
            username:username,
            rms:rms
        })
    O "caramba" não assume o valor que em tese a função retornaria -normal em outras linguagens-,
    ele vira a própria função junto com seus parametros.
    MAS, o primeiro é melhor de utilizar, diminui código
    })

    */


}


//Login
router.get("/", (req,res)=>{
    res.render("login");
})

router.post("/authenticate", (req,res)=>{
    
    const password = req.body.password;
    const username = req.body.username;

    users.findOne({where:{username:username}}).then(user=>{

        if(user!=undefined){
            //password validate
            let correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id:user.id,
                    user:user.username,
                }
                allRooms(res,username);
            
                
            }else { res.redirect("/"); }
        }else {  res.redirect("/"); }
    })
})

//Register

router.get("/register", (req,res)=>{
    res.render("register");
})


router.post("/register", (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

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
    
    const limit = req.body.limit;
    const roomname = req.body.roomname;

    rooms.findOne({where:{roomname:roomname}}).then(room =>{
  
      if(room != undefined){
        res.send("<h1>Room já existe<h1>")
      } else{
            rooms.create({   
                roomname:roomname,
                limit:limit
            }).then(()=>{
                res.send("<h1>Created Room<h1>")
        })
      }
    })
});

router.post("/selectedroom", (req,res)=>{

    const username = req.body.username;
    const roomname = req.body.select_room;

    res.render("main",{
        username:username,
        roomname:roomname
    })

})


router.get("/room",(req,res)=>{
    allRooms(res,username);
})









/*
router.get("/room/:username?", (req,res)=>{
    
    const username = req.params.username;
    console.log("NOME DO USUARIO 2: "+username)
    if(username){
        allRooms(res,username);
    }else{
       res.send("Cuidado kkk") 
    }
    
});
*/



module.exports = router;