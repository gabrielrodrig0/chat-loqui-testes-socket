/*const users = require("./database/users");
const rooms = require("./database/rooms");
const usersInRoom = require("./database/usersInRoom");

function verificando(roomName,userName,id){

    rooms.findOne({where:{roomName:roomName}}).then(room =>{
        
        //-----------------
        /*console.log("Room selecionada: -->")
        console.log("roomName: "+room.roomName+" || limit: "+room.limit+" || ID: "+id);

          if(room == undefined){
            console.log("ROOM NAO EXISTE");

          }else{ // room exists
      
            if(room.limit == "group"){
      
              usersInRoom.findOne({where:{roomName:roomName}&&{userName:userName}}).then(inRoom =>{
    
                if(inRoom!=undefined){ 
                    //usuário já esteve nessa group room
                    //atualize seu id e da um join para room
                    inRoom.socketId = id
                    console.log("ID atualizado - Grupo")
                }else { //usuário nunca esteve nessa room group
                      //ele não está ligado a sala, então da join e anexe no userIroom
                    usersInRoom.create({
                        roomName:roomName,
                        userName:userName,
                        socketId:id
                    }).then(()=>{
                        console.log("ATRELACAO FEITA COM SUCESSO");
                    })
                }
              });
              
            //PRIVADO
            }else { //room.limit == private
                console.log("roomName: "+room.roomName+" || userName: "+userName);

                usersInRoom.findOne({where:{roomName:roomName} && {userName:userName}}).then(inroom =>{
        
                if(inroom!=undefined){ 
                //usuário esteve nessa private room 
                //.atualize seu id e da um join para room
                    inroom.socketId = id
                    console.log("ID atualizado - Privado");

                }else { /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta room privada,
                    caso tenha menos de duas pessoas, usuário pode entrar 
                    

                    usersInRoom.findAll({where:{roomName:roomName}}).then(quantidade=>{
                        
                        console.log("QUANTAS PESSOAS NA SALA: "+quantidade.length)

                        if(quantidade.length == 2){//não pode entrar, chat privado

                        }else{
                            //usuário nunca esteve nessa room private
                            //ele não está ligado a sala, então da join e anexe no userIroom
                            usersInRoom.create({
                                roomName:roomName,
                                userName:userName,
                                socketId:id
    
                            }).then(()=>{
                            console.log("ATRELACAO FEITA COM SUCESSO");
                            })
                        }
                    })
                }
              })
            } 
          }
          
        })
}

module.exports = verificando;
*/