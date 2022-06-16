const WebSocket = require('ws');
const http=require('http');

const express = require('express');
const app = express();

app.use(express.static('public'));
const bserver=http.createServer(app);
const webPort = process.env.PORT || 3001;

 bserver.listen(webPort, function(){
 console.log('Web server start. http://localhost:' + webPort );
});
const wss=new WebSocket.Server({server:bserver});

wss.on('connection',ws=>{
ws.room=[];
ws.send(JSON.stringify({msg:"user joined"}));
console.log('connected');
ws.on('message', message=>{
    //try{
        var messag=JSON.parse(message);
        //}catch(e){console.log(e)}
        console.log('messag: ',messag);
        if(messag.join){ws.room.push(messag.join)}
if(messag.room){console.log('room: ',messag.room);broadcast(message);}
if(messag.msg){console.log('message: ',messag.msg)}
})

ws.on('error',e=>console.log(e) ,()=>bserver.listen(webPort, function(){
 console.log('Web server start. http://localhost:' + webPort );
}))
ws.on('close',(e)=>console.log('websocket closed'+e))

})

function broadcast(message){
wss.clients.forEach(client=>{
if(client.room.indexOf(JSON.parse(message).room)>-1){
    console.log("LOG DU MSG :",message);
client.send(message)
}
})

setInterval(() => {
    wss.clients.forEach((client) => {
      client.send(new Date().toTimeString());
    });
  }, 1000);
}