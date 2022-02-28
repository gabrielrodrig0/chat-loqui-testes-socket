/*rooms.findOne({where:{roomname:data.roomname}}).then(room =>{
            
    if(room == undefined){
      console.log("ROOM NAO EXISTE");

    }else{ // room exists
      const verificaRooms = usersInRoom.findAll({where:{roomname:data.roomname}});

      if(room.limit == "group"){  
      
          verificaRooms.then(inRoom =>{
              let local=false,i;
              for(i = 0; i<inRoom.length; i++){
                  if(inRoom[i].username == data.username){
                      local = true;break;
                  }
              }
              if(local){/*usuário já esteve nessa room
                  atualize seu id e da um join para room
                  inRoom[i].socketId = socket.id;
                  console.log("ID atualizado - Grupo")
                  
              }else{ /*usuário nunca esteve nessa room group
                      então da join e anexe no userIroom
                  usersInRoom.create({
                      roomname:data.roomname,
                      username:data.username,
                      socketId:socket.id
                  }).then(()=>{
                      console.log("ATRELACAO FEITA COM SUCESSO");
                })
              }
        });
        socket.join(data.roomname);   
        
      //PRIVADO
      }else { //room.limit == private

          verificaRooms.then(inRoom =>{

              let local0=false,i;

              for(i = 0; i<inRoom.length; i++){
                  if(inRoom[i].username == data.username){
                      local0 = true;break;
                  }
              }

              if(local0){
                  /*usuário esteve nessa private room 
               atualize seu id e da um join para room
                  socket.join(data.roomname);
                  inRoom[i].socketId = socket.id;
                  console.log("ID atualizado - Privado");

              }else{  
                  /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                  room privada, caso tenha menos de duas pessoas, usuário pode entrar 

                  if(inRoom.length == 2){//não pode entrar, chat privado
                          console.log("SALA CHEIA, NÃO VAI ENTRAR")


                  }else{
                      /*usuário nunca esteve nessa room private, mas ele pode entrar
                      então da join e anexe no userIroom
                      usersInRoom.create({
                          roomname:data.roomname,
                          username:data.username,
                          socketId:socket.id
                      }).then(()=>{
                          console.log("ATRELACAO FEITA COM SUCESSO");


                      })
                      socket.join(data.roomname);
                  }
              }
        })
      } 
    }
})
*/