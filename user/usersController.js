const express = require("express");
const users = require("../database/users");
const rooms = require("../database/rooms");
const router = express.Router();
const bcrypt = require("bcrypt");
const usersInRoom = require("../database/usersInRoom");



function renderMain(res,roomname, username,number){

    res.render("main",{
        username:username,
        roomname:roomname,
        number
    })
}





function allRooms(res,username){

    const rm=rooms.findAll({raw:true}) 

    rm.then(rms =>{
        res.render("room",{
            username:username,
            rms:rms
        })
    })
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

    //const {limit, roomname} = req.body;
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

    let number;
    
    rooms.findOne({where:{roomname:roomname}}).then(room =>{
            
        if(room == undefined){
          console.log("ROOM NAO EXISTE");

        }else{ // room exists
          const verificaRooms = usersInRoom.findAll({where:{roomname:roomname}});

          if(room.limit == "group"){  
          
              verificaRooms.then(inRoom =>{
                  let local=false,i;
                  for(i = 0; i<inRoom.length; i++){
                      if(inRoom[i].username == username){
                          local = true;break;
                      }
                  }

                  if(local){// CASE 01
                    number = 1;
                    /*usuário já esteve nessa room
                      atualize seu id e da um join para room*/
                      renderMain(res,roomname, username,number);
                      
                  }else{//CASE 02
                    number = 2;
                    
                    /*usuário nunca esteve nessa room group
                        então da join e anexe no userIroom*/
                    renderMain(res,roomname, username,number);
                  }
            });
            
          //PRIVADO
          }else { //room.limit == private

              verificaRooms.then(inRoom =>{

                  let local0=false,i;

                  for(i = 0; i<inRoom.length; i++){
                      if(inRoom[i].username == username){
                          local0 = true;break;
                      }
                  }

                  if(local0){ //CASE 03
                      /*usuário esteve nessa private room 
                   atualize seu id e da um join para room*/
                    number = 3;
                    renderMain(res,roomname, username,number);

                  }else{  
                    /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                      room privada, caso tenha menos de duas pessoas, usuário pode entrar */
                    
                    
                      if(inRoom.length == 2){
                          
                        //não pode entrar, chat privado
                        res.send("<h1>ROOM PRIVADA, SAI DAQUI<h1>")


                      }else{ //CASE 04
                        number = 4;
                          /*usuário nunca esteve nessa room private, mas ele pode entrar
                          então da join e anexe no userIroom*/
                          renderMain(res,roomname, username,number);
                      }
                  }
            })
          } 
        }
  })

    



        



/*


*/


    

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