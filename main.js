var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//app.use(express.bodyParser());
app.use(bodyParser.json());

//存放用户信息的json
var usermessage = {};
var userId = 0;
//存放还未传输的聊天信息
var chatmessage = {};
//判断用户
var avaliableUserId = new Array();
//定时器列表
var timerList = new Array();



/*
 * 初始化可用的用户id
 */
function initUserArray(){
    for(var i = 0; i < 100; i++){
        avaliableUserId[i] = 0;
        timerList[i] = null;
    }
}

/*
 * 用户退出之后删除用户在服务器中的位置角度信息
 * 参数：退出的用户对应的id
 */
function deleteUser(user_id){
    avaliableUserId[user_id] = 0;
    delete usermessage[user_id];
    timerList[user_id] = null;
    console.log("logout: " + user_id);
}


/*
 * 用户角度和位置信息类
 * 参数：用户信息 json格式
 */
function user (user_data) {
    this.user_id = user_data.user_id;
    this.user_position = {
        x:user_data.user_position.x,
        y:user_data.user_position.y,
        z:user_data.user_position.z
    };
    this.user_rotation = {
        x:user_data.user_rotation.x,
        y:user_data.user_rotation.y,
        z:user_data.user_rotation.z,
        w:user_data.user_rotation.w
    };
    //this.inputMotionValue = user_data.inputMotionValue;
}

/*
 * 聊天信息类
 * 参数：聊天信息 json格式
 */
function chatMsg(chat_data){
    this.send_id = chat_data.send_id;
    this.receive_id = chat_data.receive_id;
    this.name = chat_data.name;
    this.time = chat_data.time;
    this.content = chat_data.content;
}

/*
 * 接收聊天信息
 */
app.post('/chat',function(req,res){
    console.log(req.body);
    var c = new chatMsg(req.body);
    console.log(chatmessage[c.receive_id]);
    if(chatmessage[c.receive_id]!=undefined){
        //console.log(chatmessage[c.receive_id]);
        chatmessage[c.receive_id].push(c);
    }else{
        chatmessage[c.receive_id] = new Array();
        chatmessage[c.receive_id].push(c);
    }
    //delete chatmessage[c.receive_id];
    //console.log(chatmessage[c.receive_id]);
});


/*
 * 处理用户离开3d场景的请求
 */
app.post('/deleteUser',function(req,res){
    console.log(req.body);
    deleteUser(req.body.id);
});

/*
 * 处理用户获取id的请求
 */
app.get('/getUserId',function(req,res){
    console.log("get Id");
    var id = -1;
    for(var i = 0; i < 100; i++){
        if(avaliableUserId[i] == 0){
            id = i;
            avaliableUserId[i] = 1;
            break;
        }
    }
    res.send({
        id:id
    });
});

app.get('/', function (request, response) {
  var u = "helloworld";
  response.send(u);
});

/*
 * 处理用户post位置的请求，并给用户发送所有用户的位置和角度
 * 10秒内没有请求则判断为下线
 */
app.post('/',function(req,res){
    console.log("get post req");
    var u = new user(req.body);
    usermessage[u.user_id] = u;
    var user_array = [];
    for(var i in usermessage){
        user_array.push(usermessage[i]);
    }
    var user_chat = [];
    if(chatmessage[u.user_id]!=undefined){
        user_chat = chatmessage[u.user_id];
    }
    res.send(
        {
            user_array:user_array,
            user_chat:user_chat
        }
    );
    delete chatmessage[u.user_id];
    if(timerList[u.user_id]!=null){
        clearTimeout(timer[u.user_id]);
        timerList[u.user_id] = setTimeout(deleteUser(u.user_id),10000);
    }else{
        timerList[u.user_id] = setTimeout(deleteUser(u.user_id),10000);
    }
});


 
var server = app.listen(3333, function() {
    initUserArray();
    console.log('Listening on port %d', server.address().port);
});