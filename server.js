

const {http,io,app,express} = require("./https")
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


    socket.on("selected_room", (data,callback)=>{
        
            /*
        messages.findAll({where:{roomname:data.roomname}}).then(message=>{

            if(message==undefined){
                console.log("CHEGUEI NO MESSAGES UNDEFINED")
            }else {

                for(let i=0; i<message.length;i++){

                    const data = ({
                        roomname:message[i].roomname,
                        username:message[i].username,
                        msg:message[i].messages
                    });


                    console.log("roomname: "+message[i].roomname+" || username: "+message[i].username);
                    console.log("Mensagem: "+message[i].messages);
                    console.log("----------------------------------------")

                    io.to(data.roomname).emit("showmessage", message[i])
                }
            }

        })*/
        

        /*
        messages.findAll({where:{roomname:data.roomname}}).then(message=>{

            if(message==undefined){
                console.log("CHEGUEI NO MESSAGES UNDEFINED")
            }else {
                console.log("VÁ VIR O FOR EM SEGUIDA")
                for(let i=0; i<message.length;i++){
                    console.log("roomname: "+message[i].roomname+" || username: "+message[i].username);
                    console.log("Mensagem: "+message[i].messages);
                    io.to(data.roomname).emit("showmessage", message[i])
                }
            }

        })*/









        rooms.findOne({where:{roomname:data.roomname}}).then(room =>{
            
              if(room == undefined){
                console.log("ROOM NAO EXISTE");
    
              }else{ // room exists
                const verificaRooms =usersInRoom.findAll({where:{roomname:data.roomname}});

                if(room.limit == "group"){  
                
                    verificaRooms.then(inRoom =>{
                        let local=false,i;
                        for(i = 0; i<inRoom.length; i++){
                            if(inRoom[i].username == data.username){
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
                         atualize seu id e da um join para room*/
                            socket.join(data.roomname);
                            inRoom[i].socketId = socket.id;
                            console.log("ID atualizado - Privado");

                        }else{  
                            /*nunca esteve nessa room antes, verificar quantas pessoas tem nesta 
                            room privada, caso tenha menos de duas pessoas, usuário pode entrar */
        
                            if(inRoom.length == 2){//não pode entrar, chat privado
                                    console.log("SALA CHEIA, NÃO VAI ENTRAR")
                            }else{
                                /*usuário nunca esteve nessa room private, mas ele pode entrar
                                então da join e anexe no userIroom*/
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


        messages.findAll({where:{roomname:data.roomname}}).then(message=>{

            /*if(message==undefined){
                console.log("CHEGUEI NO MESSAGES UNDEFINED")
            }else {
                console.log("VÁ VIR O FOR EM SEGUIDA")
                for(let i=0; i<message.length;i++){
                    console.log("roomname: "+message[i].roomname+" || username: "+message[i].username);
                    console.log("Mensagem: "+message[i].messages);
                    io.to(data.roomname).emit("showmessage", message[i])
                }
            }*/
            

            

            /*const data = ({
                roomname:message[i].roomname,
                username:message[i].username,
                msg:message[i].messages
            });*/
            let list=[];
            for(let i=0; i<message.length;i++){
                
                const data = ({
                    roomname:message[i].roomname,
                    username:message[i].username,
                    msg:message[i].messages
                })

            list.push(data);
                
            }
            
            callback(list);
        })











    })
      
      
    socket.on("message", (data)=>{

        usersInRoom.findAll({where:{roomname:data.roomname}}).then(inRoom=>{
            let local;
            for(let i = 0; i<inRoom.length; i++){
                if(inRoom[i].username == data.username){
                    local = true;
                }
            }
            if(local){

                messages.create({
                    roomname:data.roomname,
                    username:data.username,
                    messages:data.msg
                })

                io.to(data.roomname).emit("showmessage", data)
            }else{
                console.log("Voce nao deveria estar nessa sala")
            }
        })

        

    })

    
})













































http.listen(3000, ()=>{
    console.log("Servidor aberto na porta 3000");
})