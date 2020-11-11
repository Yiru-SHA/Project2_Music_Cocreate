//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

// //Initialize socket.io
//npm install socket.io

let io = require('socket.io').listen(server);

//private namespace
let private = io.of('/private');
//save data from another socket,global
let musicIndex =[];  
let counter = 0;

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('disconnect',function(){
        console.log("socket disconected"+socket.id);
        counter--;
        let disconnectUser ={
            "UserID" : socket.id,
            "UserLeft":counter
        }
        io.sockets.emit(disconnectUser);
    })

    socket.on('joined',()=>{
        counter++;
        let idIndex = {
            "UserID" : socket.id,
            "UserJoined":counter
    }
        io.sockets.emit('joined',(idIndex));
        console.log(idIndex);
    })

    socket.on('bubbleData',(data)=>{
    console.log(data);  
    musicIndex.push(data.musicIndex);
    io.sockets.emit('bubbleData',(data));
    });

    socket.on('playPreview',()=>{
        console.log("mouse is overed")
        let mIndex = {"indexes": musicIndex};
        socket.emit('previews',mIndex);
    })

})



//Listen for individual clients/users to connect the private namespace
private.on('connection', function(socket) {
    console.log("private Namespace conneted!!");
    console.log("We have a new client: " + socket.id);

    socket.on('playPreview',()=>{
        console.log("mouse is overed")
        let mIndex = {"indexes": musicIndex};
        socket.emit('previews',mIndex);
        console.log(mIndex);
    })

    socket.on('joined',()=>{
        counter++;
        let idIndex = {
            "UserID" : socket.id,
            "UserJoined":counter
    }
        io.sockets.emit('joined',(idIndex));
        console.log(idIndex.UserJoined);
    })

    socket.on('disconnect',function(){
        console.log("socket disconected"+socket.id);
    })

    socket.on('bubbleData',(data)=>{
    console.log(data);   
    private.emit('bubbleData',(data));
    musicIndex.push(data.musicIndex);
    });

})