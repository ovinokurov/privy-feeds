/*var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/
/*
var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);
*/
/*
db.test.find({sex: "female"}, function(err, users) {
  if( err || !users) console.log("No female users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});
*/


//Save User
/*
db.users.save({email: "3onemore@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});
*/

/*
db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, function(err, updated) {
  if( err || !updated ) console.log("User not updated");
  else console.log("User updated");
});
*/

//global = this;
//global.GLOBAL = global;
//global.maleUser = "Oleg";

/*
var stringSomething = "{\"a\",1}";

db.users.find({sex: "male"}, function(err, users) {
  if( err || !users) console.log("No male users found");
  else users.forEach( function(maleUser) {
    //console.log(maleUser);
	stringSomething=maleUser;
	//console.log(global.maleUser);
  } )
});
*/

var dburl = "localhost/mangoapp"; // "username:password@example.com/mydb"
var collections = ["users"]
var db = require("mongojs").connect(dburl, collections);


function user(firstname, lastname, email){
	this.firstname = firstname;
	this.lastname = lastname;
	this.email=email;
}


db.users.remove({"email" : "olegvinokurov@hotmail.com"});

db.users.ensureIndex({email:1},{unique:true});

var user1 = new user("Oleg","Vinokurov","olegvinokurov@hotmail.com");

db.users.save(user1,function(err,savedUser){
  if( err || !savedUser ) console.log("User " + user.email + " not saved because of error " + err);
  else console.log("User " + savedUser.email + " saved");
});


/*
var user2 = new user("Oleg","Vinokurov","olegvinokurov@hotmail.com");

db.users.save(user2,function(err,savedUser){
  if( err || !savedUser ) console.log("User " + user.email + " not saved because of error " + err);
  else console.log("User " + savedUser.email + " saved");
});
*/

db.users.find(user1, function(err, users) {
  if( err || !users.length) console.log("User " + user.email + " not found.");
  else users.forEach( function(user) {
    console.log("User Found ! - " + user);
  });
});


var http = require('http');

/*
http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/plain'});
  res.writeHead(200, {'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*"});
  //res.end('Hello World\n');  
  res.end(stringSomething);  
}).listen(1337, '127.0.0.1');
*/

var user3 = new user("Oleg3","Vinokurov3","olegvinokurov@hotmail.com3");

/*
http.createServer(function(req, res){
	db.users.find(user1, function(err, users) {
	  if( err || !users.length){ 
	  //console.log("User " + user3.firstname + " not found.");
	  res.writeHead(200, {
		'Content-Type' : 'application/json',
		'Access-Control-Allow-Origin':'*'
		});
		res.end(JSON.stringify([{"Error":"User "+user3.firstname+" not found."}]));
	  }else{ users.forEach( function(user) {
		//console.log("User Found ! - " + user);
		res.writeHead(200, {
		'Content-Type' : 'application/json',
		'Access-Control-Allow-Origin':'*'
		});
		res.end(JSON.stringify(users));
	  });
	  }
	});
  }).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/



/*
db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, function(err, updated) {
  if( err || !updated ) console.log("User not updated");
  else console.log("User updated");
});
*/




var url = require('url');
http.createServer(function (req, res) {
	var objUsers = [];
    //"female"
    var sex = url.parse(req.url).pathname.substr(1);
    //console.log(sex);
    res.writeHead(200, {'Content-Type': 'application/json'})
    db.users.find({sex: sex}, function(err, users) {
        if(err || users=="")
            //console.log("No " + sex + " users found");
            res.write(JSON.stringify([{"Error:" : "No " + sex + " users found"}]));
            //console.log("No users found");
        else
            users.forEach( function(User) {
            //console.log(femaleUser);
			//console.log(User) ;
			objUsers.push(User);
        } );
		res.write(JSON.stringify(objUsers));
        res.end();
    });


}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');




