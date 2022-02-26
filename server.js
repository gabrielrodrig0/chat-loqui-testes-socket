
const {http} = require("./https");
const {io} = require("./https");
const {app} = require("./https");
const {express} = require("./https");
const bodyParser = require("body-parser");
const users = require("./database/users");
const usersController = require("./user/usersController");
const session = require("express-session");
const middlewares = require("./middlewares/auth");
const rooms = require("./database/rooms");
const usersInRoom = require("./database/usersInRoom");
const messages = require("./database/messages");


//session

app.use(session({
    secret:"tchurusbangos",
    cookie: {maxAge: 30000000}
}))


//template engine 
app.set("view engine", "ejs");

//static files
app.use(express.static("public"));

//body parser 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//routes 
app.use("/", usersController);


//Principal socket 

app.get("/main", middlewares,(req,res)=>{
    users.findOne({where:{username:req.session.user.user}}).then(user=>{
        let username = user.username;
        res.render("main", {username:username});
        console.log(username+" se conectou!");
    })
})





io.on("connection", (socket)=>{

    console.log("Conexão feita com Sucesso")


    socket.on("selected_room", (data)=>{
        /*
        messages.findAll({where:{roomName:data.roomName}}).then(message=>{
            console.log("ARRRRAAAYAYYAYAYYAYAYYAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
            console.log("TAMANHO DO ARRAY: "+ message.undefined)
            if(message==undefined){
                console.log("CHEGUEI NO MESSAGES UNDEFINED")
            }else {
                console.log("VÁ VIR O FOR EM SEGUIDA")
                for(let i=0; i<message.length;i++){
                    console.log("roomName: "+message[i].roomName+" || userName: "+message[i].userName);
                    console.log("Mensagem: "+message[i].msg);
                    io.to(data.roomName).emit("showmessage", message[i])
                }
            }

        })
        */
        
        rooms.findOne({where:{roomName:data.roomName}}).then(room =>{
            
              if(room == undefined){
                console.log("ROOM NAO EXISTE");
    
              }else{ // room exists
          
                if(room.limit == "group"){
                    usersInRoom.findAll({where:{roomName:data.roomName}}).then(inRoom =>{
                        let local=false,i;
                        for(i = 0; i<inRoom.length; i++){
                            if(inRoom[i].userName == data.userName){
                                local = true;break;
                            }
                        }
                        if(local){/*usuário já esteve nessa room
                            atualize seu id e da um join para room*/
                            inRoom[i].socketId = socket.id;
                            console.log("ID atualizado - Grupo")
                            
                        }else{ /*usuário nunca esteve nessa room group
                                então da join e anexe no userIroom*/
                          usersInRoom.create({
                              roomName:data.roomName,
                              userName:data.userName,
                              socketId:socket.id
                          }).then(()=>{
                              console.log("ATRELACAO FEITA COM SUCESSO");
                          })
                        }
                  });
                  socket.join(data.roomName);   
                  

                  


                  


                //PRIVADO
                }else { //room.limit == private
    
                    usersInRoom.findAll({where:{roomName:data.roomName}}).then(inRoom =>{
                        let local0=false,i;
                        for(i = 0; i<inRoom.length; i++){
                            if(inRoom[i].userName == data.userName){
                                console.log("NOMES: "+inRoom[i].userName)
                                local0 = true;break;
                            }
                        }
                        console.log("TAMANHO DO INROOOOOMM: "+inRoom.lenght)
                        if(local0){
                            /*usuário esteve nessa private room 
                         atualize seu id e da um join para room*/
                            socket.join(data.roomName);
                            inRoom[i].socketId = socket.id;
                            console.log("ID atualizado - Privado");

                        }else{  
                            /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                            room privada, caso tenha menos de duas pessoas, usuário pode entrar */
                                console.log("QUANTAS PESSOAS NA SALA: "+inRoom.length)
        
                                if(inRoom.length == 2){//não pode entrar, chat privado
                                    console.log("SALA CHEIA, NÃO VAI ENTRARRRRR")
                                }else{
                                    /*usuário nunca esteve nessa room private, mas ele pode entrar
                                    então da join e anexe no userIroom*/
                                    usersInRoom.create({
                                        roomName:data.roomName,
                                        userName:data.userName,
                                        socketId:socket.id
            
                                    }).then(()=>{
                                    console.log("ATRELACAO FEITA COM SUCESSO");
                                    })
                                    socket.join(data.roomName);
                                }

                        }
                    
                  })
                } 
              }

        })

    })
      
      
    socket.on("message", (data)=>{
        //roomName userName msg
        //roomName, userName, messages
        usersInRoom.findAll({where:{roomName:data.roomName}}).then(inRoom=>{
            let local;
            for(let i = 0; i<inRoom.length; i++){
                if(inRoom[i].userName == data.userName){
                    local = true;
                }
            }
            if(local){

                messages.create({
                    roomName:data.roomName,
                    userName:data.userName,
                    messages:data.msg
                })

                io.to(data.roomName).emit("showmessage", data)
            }else{
                console.log("Voce nao deveria estar nessa sala")
            }
        })

        

    })

    
})













































http.listen(3000, ()=>{
    console.log("Servidor aberto na porta 3000");
})