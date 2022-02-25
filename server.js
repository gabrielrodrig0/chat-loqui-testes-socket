const express = require("express");
const app = express();
const http = require("http").createServer(app)
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const users = require("./database/users");
const usersController = require("./user/usersController");
const session = require("express-session");
const middlewares = require("./middlewares/auth");
const rooms = require("./database/rooms");
const usersInRooms = require("./database/usersInRoom");
//---------------------------------------------

//---------------------------------------------
let count = 0;
let userList = [];

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
        var username = user.username;
        res.render("main", {username:username});
        console.log(username+" se conectou!");
    })
})
/*
io.on("connection", (socket)=>{
    
    count++;
    userList.push(socket.id);
    console.log(userList);
    
    console.log(socket.id+" entrou!");
    console.log(count+" usuários on-line!");
    
    

    socket.on("disconnect", ()=>{
        count--;
        for (let k=0; k<userList.length; k++){
            if(userList[k]===socket.id){
                userList.splice(k,1);
            }
        }
        //console.log(socket.id+" se desconectou!");
        console.log(count+" usuários on-line!");
        console.log(userList);
    })

    socket.on("message", data=>{
        console.log(data.nome+": "+data.msg);
        io.emit("showmessage", data);
    })

    //USERS ONLINE
    socket.on("userOnline", dado=>{
        io.emit("showUser", dado);
    })

    
})
*/



http.listen(3000, ()=>{
    console.log("Servidor aberto na porta 3000");
})