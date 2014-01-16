
//var databaseUrl = "localhost"; // "username:password@example.com/mydb"
//var databaseUrl = "oleg:1234@paulo.mongohq.com:10029/HQdb"
var databaseUrl = "privy"; // "username:password@example.com/mydb"

//var collections = ["users", "reports"]
var collections = ["newsFeed"]
var db = require("mongojs").connect(databaseUrl, collections);


//db.newsFeed.find({"success": true}, function(err, feeds) {
//test DB
/*
db.newsFeed.find({"id":14}, function(err, feeds) {
    if( err || !feeds) console.log("No Feeds found");
    else feeds.forEach( function(feed) {
        console.log(feed);
    } );
});

*/


var http = require('http');
var url = require('url');


function isEmpty(ob){
   for(var i in ob){ return false;}
  return true;
}


http.createServer(function (req, res) {
var origin =(req.headers.origin || "*");

console.log("origin = " + origin);

res.removeHeader("Content-Encoding");	
res.setHeader('Access-Control-Allow-Credentials', true); 
res.setHeader('Access-Control-Allow-Origin', origin); 
res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
res.setHeader('Access-Control-Allow-Headers','X-Requested-With, Content-MD5,Content-Type'); 

res.writeHead(200, {'Content-Type': 'application/json'});

    var objFeeds = [];
	//memberid: "A000000323"
    var memberid = url.parse(req.url).pathname.substr(7);
    console.log(memberid);
	var now = new Date();		
	console.log(now);
	var newJson = "";
	console.log("=====================");
	console.log(req.method);

	var body = "";
	  req.on('data', function (chunk) {body += chunk;});
	  req.on('end', function () {console.log('POSTed: ' + body);
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);
	    console.log("========= Json Object START ========");
		newJson = body;
		console.log(newJson); 
		console.log("========= Json Object END ==========");
	  });
	  
	  
	
	console.log("=====================");
	var variables = url.parse(req.url, true).query;
	var pathname = url.parse(req.url).pathname;	
	console.log("variables = " + variables);
	console.log("pathname = " + pathname);	
	console.log("|=====================");
	
	var flagFeeds=pathname.indexOf("feeds"); 
	console.log("flagFeeds = " + flagFeeds);
	
	var flagUpdate=pathname.indexOf("update");
	console.log("flagUpdate = " + flagUpdate);
	
	var flagChange=pathname.indexOf("change");
	console.log("flagChange = " + flagChange);
	
	var flagDelete=pathname.indexOf("delete");
	console.log("flagDelete = " + flagDelete);
	
	var flagCreate=pathname.indexOf("create");
	console.log("flagCreate = " + flagCreate);
	
	var flagGet=pathname.indexOf("get");
	console.log("flagGet = " + flagGet);
	
	var flagRemove=pathname.indexOf("remove");
	console.log("flagRemove = " + flagRemove);

	var flagAdd=pathname.indexOf("add");
	console.log("flagAdd = " + flagAdd);	
	
	var url_parts = url.parse(req.url,true);
	//var callback = url_parts.query.callback;
	
	var frm = (url_parts.query.frm)-1;
	var to = (url_parts.query.to)-0;
	
	var rid = (url_parts.query.rid);
	

	
	console.log("from = " + frm);
	console.log("to = " + to);
	
	if(!url_parts.query.frm || !url_parts.query.to)
	{
		to=0;
		frm=0;
	}
	
	//console.log(url_parts.query);
	//console.log(url_parts.query.callback);
	

	
	
	
	//read
	//http://24.199.44.254:8181/feeds/A000000322
	//http://24.199.44.254:8181/feeds/A000000323

	if(flagFeeds==1)
	{
	//db.newsFeed.find({"memberid":"2"},{body:{$slice:[1,2]}})
	  //db.newsFeed.find({"memberid":memberid},{body:{$slice:[1,2]}}, function(err, feeds) {
		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
			if(err || feeds=="")
			{    res.write(JSON.stringify([{"Error" : "No Success feeds found"}]));
				//var jsonObj = "angular.callbacks._0({_id: \"\", id: 12, memberid: " + memberid + ",status: 400,body: [{}]}"
				//res.write("angular.callbacks._0("+ jsonObj+");");
			}
			else
				feeds.forEach( function(Feed) {
					objFeeds.push(Feed);
			} );
			if(!isEmpty(objFeeds)){
				//{['some string 1', 'some data', 'whatever data']}
				res.write(JSON.stringify(objFeeds));
				//res.write(JSON.stringify(objFeeds));
			}
			res.end();
			//db.close();
		});
	}
	
	
	if(flagGet==1)
	{

	memberid = url.parse(req.url).pathname.substr(5);

	//db.newsFeed.find({"memberid":"2"},{body:{$slice:[1,2]}})
	  db.newsFeed.find({"memberid":memberid},{body:{$slice:[frm,to]}}, function(err, feeds) {
		//db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
			if(err || feeds=="")
			{    res.write(JSON.stringify([{"Error" : "No Success feeds found"}]));
				//var jsonObj = "angular.callbacks._0({_id: \"\", id: 12, memberid: " + memberid + ",status: 400,body: [{}]}"
				//res.write("angular.callbacks._0("+ jsonObj+");");
			}
			else
				feeds.forEach( function(Feed) {
					objFeeds.push(Feed);
			} );
			if(!isEmpty(objFeeds)){
				//console.log(JSON.stringify(objFeeds));
				res.write(JSON.stringify(objFeeds));
				//res.write(JSON.stringify(objFeeds));
			}
			res.end();
			//db.close();
		});
	}
	
	
	//http://24.199.44.254:8181/delete/A00000032 (unknow memberid)
	//http://24.199.44.254:8181/delete/A000000322
	if(flagDelete==1)
	{
		var memberid = url.parse(req.url).pathname.substr(8);
		var memberDelete = false;
		console.log("memberid : " + memberid);
		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
		{
			console.log("DONT DELETE NOW");
		}
		else
			memberDelete = true;
			db.newsFeed.remove({"memberid":memberid}, function(err, remove) {
			if(err || remove=="")
			{    
				console.log("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :"+memberDelete+"}");
			}
			else
				console.log("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :"+memberDelete+"}");
			});
			res.write("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :"+memberDelete+"}");
			res.end();
		} );
	}
	
	if(flagCreate==1)
	{
	var memberid = url.parse(req.url).pathname.substr(8);

	console.log("newJson -----------------");
	console.log(newJson);	
	console.log("newJson -----------------");	

	var memberCreate = true;
	var CREATEerrorMSG = "no errors";

	db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
			{    
			console.log("SAVING....");
				try {
					db.newsFeed.save(JSON.parse(newJson), function(err, saved) {
					if( err || !saved ) memberCreate = false;
					});
				} catch (e) {
					console.log("Can't Save not JSON");
					memberCreate = false;
					CREATEerrorMSG = "broken json";
				}

			}
			else
			{
				console.log("Can't Save existing member");
				CREATEerrorMSG = "member already existed";
				memberCreate = false;
				//res.end();
			}
			console.log("{\"memberid\": \"" + memberid + "\",\"method\":\"create\",\"success\" :"+memberCreate+", \"create\": "+memberCreate+" , \"error\":\""+CREATEerrorMSG+"\"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"method\":\"create\",\"success\" :"+memberCreate+", \"create\": "+memberCreate+" , \"error\":\""+CREATEerrorMSG+"\"}");
			res.end();
		});


	}
	
	if(flagUpdate==1)
	{
	var UPDATEerrorMSG = "no errors";
	  var body2 = "";
	  req.on('data', function (chunk) {body2 += chunk;});
	  req.on('end', function () {console.log('UPDATE: ' + body2);
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);

		newJson2 = body2;

		var memberid = url.parse(req.url).pathname.substr(8);
		var memberUpdate = true;

		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
			{    
			console.log("UPDATING....");
				console.log("Can't update none existing member");
				UPDATEerrorMSG = "Can't update none existing member";
				memberUpdate = false;
				//res.end();
			}
			else
			{
				try {
				db.newsFeed.update({memberid: memberid}, {$set: {body: JSON.parse(newJson2)}}, function(err, updated) {
				  if( err || !updated ) console.log("User not updated");
				  else console.log("User updated");
				});
				} catch (e) {
					console.log("Can't Update not JSON");
					UPDATEerrorMSG = "broken json";
					memberUpdate = false;
				}

			}
			//console.log("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			//res.write("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			console.log("{\"memberid\": \"" + memberid + "\",\"method\":\"update\",\"update\": "+memberUpdate+" ,\"success\" :"+memberUpdate+", \"error\":\""+UPDATEerrorMSG+"\"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"method\":\"update\",\"update\": "+memberUpdate+" ,\"success\" :"+memberUpdate+", \"error\":\""+UPDATEerrorMSG+"\"}");

			res.end();

			});
	  });
	}

	if(flagChange==1)
	{
	console.log("Changing.......");
	var CHANGEerrorMSG = "no errors";
	  var body3 = "";
	  req.on('data', function (chunk) {body3 += chunk;});
	  req.on('end', function () {console.log('UPDATE: ' + body3);
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);

		var newJson3 = body3;
		
		var memberid = url.parse(req.url).pathname.substr(8);
		var memberChange = true;

		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		//db.newsFeed.find({"memberid":memberid},{body:{$slice:[frm,to]}}, function(err, feeds) {
		if(err || feeds=="")
			{    
			console.log("CHANGING....");
				console.log("Can't change none existing member " + memberid);
				CHANGEerrorMSG = "Can't change none existing member "+ memberid;
				memberChange = false;
			}
			else
			{
				try {
				var setModifier = { $set: {} };
				setModifier.$set['body.'+rid] = JSON.parse(newJson3);
				
				//db.newsFeed.update({'memberid': memberid}, {$set: {"body.0": JSON.parse(newJson3)}}, function(err, updated) {
				db.newsFeed.update({'memberid': memberid}, setModifier, function(err, updated) {
				  if( err || !updated ) console.log("User not updated");
				  else console.log("User updated");
				});
				} catch (e) {
					console.log("Can't Change not JSON");
					CHANGEerrorMSG = "broken json";
					console.log(e);
					memberChange = false;
				}

			}

			console.log("{\"memberid\": \"" + memberid + "\",\"method\":\"change\",\"change\": "+memberChange+" ,\"success\" :"+memberChange+", \"error\":\""+CHANGEerrorMSG+"\"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"method\":\"change\",\"change\": "+memberChange+" ,\"success\" :"+memberChange+", \"error\":\""+CHANGEerrorMSG+"\"}");
			res.end();

			});
	  });
	}

	
	if(flagRemove==1)
	{

	var REMOVEerrorMSG = "no errors";
	  var body4 = "";
	  req.on('data', function (chunk) {body4 += chunk;});
	  req.on('end', function () {console.log('UPDATE: ' + body4);
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);

		var newJson4 = body4;
		
		var memberid = url.parse(req.url).pathname.substr(8);
		console.log("memberid: " + memberid +"!");
		var memberRemove = true;

		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		//db.newsFeed.find({"memberid":memberid},{body:{$slice:[frm,to]}}, function(err, feeds) {
		if(err || feeds=="")
			{    
			console.log("REMOVING....");
				console.log("Can't remove none existing member " + memberid);
				REMOVEerrorMSG = "Can't remove none existing member "+ memberid;
				memberRemove = false;
			}
			else
			{
				try {
				var setModifier = { $set: {} };
				setModifier.$set['body.'+rid] = JSON.parse(newJson4);
				
				//{ $pull: { "items" : { id: 23 } } }
				
				//db.newsFeed.update({'memberid': memberid}, {$set: {"body.0": JSON.parse(newJson3)}}, function(err, updated) {
				//db.newsFeed.remove({"memberid":memberid}, function(err, remove) { 
				//db.newsFeed.update({'memberid': memberid}, {$pull:setModifier}, function(err, updated) {
				db.newsFeed.update({'memberid': memberid}, setModifier, function(err, updated) {
				  if( err || !updated ) console.log("User record " + rid + " not removed");
				  else console.log("Record " + rid + " removed");
				});
				} catch (e) {
					console.log("Can't Remove not JSON");
					CHANGEerrorMSG = "broken json";
					console.log(e);
					memberRemove = false;
				}

			}

			console.log("{\"memberid\": \"" + memberid + "\",\"method\":\"remove\",\"remove\": "+memberRemove+" ,\"success\" :"+memberRemove+", \"error\":\""+CHANGEerrorMSG+"\"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"method\":\"remove\",\"remove\": "+memberRemove+" ,\"success\" :"+memberRemove+", \"error\":\""+CHANGEerrorMSG+"\"}");
			res.end();

			});
	  });
	}
	

	if(flagAdd==1)
	{
 
		console.log("ADD!!!!");
		//db.cats.update({_id:123}, {$push: {kittens:456}})
		//db.newsFeed.update({'memberid': memberid}, JSON.parse("[{\"name\":\"joe\"}]"), function(err, updated) {
		db.newsFeed.update({memberid: memberid}, {$pushAll: {body: JSON.parse("[{\"name\":\"joe\"}]")}}, function(err, updated) {
		  if( err || !updated ) console.log("User record " + rid + " not removed");
		  else console.log("Record " + rid + " removed");
		});
	}
	
	

////////////////////////////	

	
//remove from body	
//db.newsFeed.remove({"memberid":memberid}, function(err, remove) { 	
	
	
}).listen(8181, '192.168.76.3');
console.log('Server running at http://69.89.76.3:8181');