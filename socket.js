var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var onlineUser = [];        //在线用户

io.on('connect',function(socket){
    console.log('a user connect...');


    // 监听用户登入
    socket.on('login',function(obj){
        socket.name = obj.userid;
        if(JSON.stringify(onlineUser).indexOf(JSON.stringify(obj))==-1){
            onlineUser.push(obj);
        }

        //向所有客户端广播用户加入
        io.emit('login',{onlineUser: onlineUser, user:obj});
        console.log(obj.username+"加入直播间！");
    });

    // 监听用户登出
    socket.on('disconnect',function(){   
        var obj = onlineUser.filter(item=>item.userid==socket.name)[0];
        onlineUser = onlineUser.filter(item=>item.userid!=socket.name);
        io.emit('logout',{onlineUser:onlineUser, user:obj});
        console.log(obj.username+"退出了直播间！");
    });

    // 监听用户发布的聊天内容
    socket.on('message',function(obj){
        // io.emit('message',obj);              //向所有客户端发送消息
        socket.broadcast.emit('message',obj);   //向除自己外的所有客户端发送消息
        console.log(obj.user.username+'说：'+obj.content);
    })
});

http.listen(3000,function(){
    console.log('listen on 3000....');
});