var express = require('express');
var path = require('path');
var app = express();
// 使用静态资源引用，public目录
app.use(express.static(path.join(__dirname,'public')));


app.listen(8080,function(){
    console.log('app is listen 8080...');
});