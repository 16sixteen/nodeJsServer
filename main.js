var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//app.use(express.bodyParser());
app.use(bodyParser.json());

var usermessage = {};
var userId = 0;

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

app.get('/getUserId',function(req,res){
    var id = 0;
    res.send(id);
});

app.get('/', function (request, response) {
  var u = "helloworld";
  response.send(u);
});

app.post('/',function(req,res){
    console.log("get post req");
    //console.log(req.body);
    var u = new user(req.body);
    console.log(u.user_id);
    usermessage[u.user_id] = u;
    console.log(usermessage);
    var user_array = [];
    for(var user in usermessage){
        user_array.push(usermessage[user]);
    }
    res.send(
        {user_array:user_array}
        );
});


 
var server = app.listen(3333, function() {
    console.log('Listening on port %d', server.address().port);
});