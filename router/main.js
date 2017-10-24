module.exports = function(app, fs)
{
    app.get('/',function(req,res){
        res.render('index.html')
	});

    app.get('/about',function(req,res){
    	res.render('about.html');
    });
    //첫번째 API: GET /list
    app.get('/list', function (req, res) {
    	fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
        	console.log( data );
        	res.end( data );
    	});
	})
    //두번째 API:  GET /getUser/:username
    app.get('/getUser/:username', function(req, res){
       fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
       });
    });

}