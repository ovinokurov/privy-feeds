
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

//OLEG console.log("origin = " + origin);

res.removeHeader("Content-Encoding");	
res.setHeader('Access-Control-Allow-Credentials', true); 
res.setHeader('Access-Control-Allow-Origin', origin); 
res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
res.setHeader('Access-Control-Allow-Headers','X-Requested-With, Content-MD5,Content-Type'); 

res.writeHead(200, {'Content-Type': 'application/json'});

    var objFeeds = [];
	//memberid: "A000000323"
    var memberid = url.parse(req.url).pathname.substr(7);
    //OLEG console.log(memberid);
	var now = new Date();		
	//OLEG console.log(now);
	var newJson = "";
	//OLEG console.log("=====================");
	//OLEG console.log(req.method);

	var body = "";
	  req.on('data', function (chunk) {body += chunk;});
	  req.on('end', function () {/* console.log('POSTed: ' + body);*/
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);
	    //OLEG console.log("========= Json Object START ========");
		newJson = body;
		//OLEG console.log(newJson); 
		//OLEG console.log("========= Json Object END ==========");
	  });
	  
	  
	
	//OLEG console.log("=====================");
	var variables = url.parse(req.url, true).query;
	var pathname = url.parse(req.url).pathname;	
	//OLEG console.log("variables = " + variables);
	//OLEG console.log("pathname = " + pathname);	
	//OLEG console.log("|=====================");
	
	var flagFeeds=pathname.indexOf("feeds"); 
	//OLEG console.log("flagFeeds = " + flagFeeds);
	
	var flagUpdate=pathname.indexOf("update");
	//OLEG console.log("flagUpdate = " + flagUpdate);
	
	var flagDelete=pathname.indexOf("delete");
	//OLEG console.log("flagDelete = " + flagDelete);
	
	var flagCreate=pathname.indexOf("create");
	//OLEG console.log("flagCreate = " + flagCreate);
	
	

	var url_parts = url.parse(req.url,true);
	var callback = url_parts.query.callback;
	//console.log(url_parts.query);
	//console.log(url_parts.query.callback);
	

	
	
	
	//read
	//http://24.199.44.254:8181/feeds/A000000322
	//http://24.199.44.254:8181/feeds/A000000323	
	if(flagFeeds==1)
	{
		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
			if(err || feeds=="")
			{    res.write(callback+"("+JSON.stringify([{"Error" : "No Success feeds found"}])+")");
				//var jsonObj = "angular.callbacks._0({_id: \"\", id: 12, memberid: " + memberid + ",status: 400,body: [{}]}"
				//res.write("angular.callbacks._0("+ jsonObj+");");
			}
			else
				feeds.forEach( function(Feed) {
					objFeeds.push(Feed);
			} );
			if(!isEmpty(objFeeds)){
				//{['some string 1', 'some data', 'whatever data']}
				res.write(callback+"("+ JSON.stringify(objFeeds)+");");
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

		//db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		//dont delete while testing....
		/*
			db.newsFeed.remove({"memberid":memberid}, function(err, feeds) {
			
				if(err || feeds=="")
				{    
					//res.write(callback+"([{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :false, \"error\" : \"Member not found\"}])");
					res.write("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :false, \"error\" : \"Member not found\"}");
				}
				else
					//res.write(callback+"([{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :true}])");
					res.write("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :true}");
				//}
				//res.write("{\"memberid\": \"" + memberid + "\",\"method\": \"delete\",\"success\" :true}");
				res.end();
			});
		*/
		//delete start
			var memberDelete = false;
			//OLEG console.log("memberid : " + memberid);
			db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
			if(err || feeds=="")
			{
				//OLEG console.log("DONT DELETE NOW");
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

	//OLEG console.log("newJson -----------------");
	//OLEG console.log(newJson);	
	//OLEG console.log("newJson -----------------");	

	var memberCreate = true;

	db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
			{    
			//OLEG console.log("SAVING....");
				try {
					db.newsFeed.save(JSON.parse(newJson), function(err, saved) {
					if( err || !saved ) memberCreate = false;
					});
				} catch (e) {
					//OLEG console.log("Can't Save not JSON");
					memberCreate = false;
				}

			}
			else
			{
				//OLEG console.log("Can't Save existing member");
				memberCreate = false;
				res.end();
			}
			//OLEG console.log("{\"memberid\": \"" + memberid + "\",\"create\": "+memberCreate+"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"create\": "+memberCreate+"}");
			res.end();
		});


	}
	
	if(flagUpdate==1)
	{
	///////////////
	  var body2 = "";
	  req.on('data', function (chunk) {body2 += chunk;});
	  req.on('end', function () {console.log('UPDATING...');
	   //req.on('end', function () {console.log('POSTed: ' + JSON.parse( body ));
	   //var json = qs.parse(body);
	   //console.log(json);

		newJson2 = body2;

		
		////////////////
		var memberid = url.parse(req.url).pathname.substr(8);
		var memberUpdate = true;

		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
			{    
			//OLEG console.log("UPDATING....");
				//OLEG console.log("Can't update update none existing member");
				memberUpdate = false;
				res.end();
			}
			else
			{
				try {
				db.newsFeed.update({memberid: memberid}, {$set: {body: JSON.parse(newJson2)}}, function(err, updated) {
				  if( err || !updated ) console.log("User not updated");
				  else console.log("User updated");
				});
				} catch (e) {
					//OLEG console.log("Can't Update not JSON");
					memberUpdate = false;
				}

			}
			console.log("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			res.end();
		});
		
	  });
	  
	///////////////
	/*
		var memberid = url.parse(req.url).pathname.substr(8);
		var memberUpdate = true;

		db.newsFeed.find({"memberid":memberid}, function(err, feeds) {
		if(err || feeds=="")
			{    
			console.log("UPDATING....");
				console.log("Can't update update none existing member");
				memberUpdate = false;
				res.end();
			}
			else
			{
				try {
				db.newsFeed.update({memberid: memberid}, {$set: {body: [JSON.parse(newJson)]}}, function(err, updated) {
				  if( err || !updated ) console.log("User not updated");
				  else console.log("User updated");
				});
				} catch (e) {
					console.log("Can't Update not JSON");
					memberUpdate = false;
				}

			}
			console.log("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			res.write("{\"memberid\": \"" + memberid + "\",\"update\": "+memberUpdate+"}");
			res.end();
		});
	*/	
	}
	
	
}).listen(8181, '24.199.44.254');
console.log('Server running at http://24.199.44.254:8181');