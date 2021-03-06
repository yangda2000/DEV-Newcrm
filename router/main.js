module.exports = function(app, fs, Crm_users_db, Crm_user)
{
    app.get('/',function(req,res){
        res.render('index.html')
	});

    app.get('/about',function(req,res){
    	res.render('about.html');
    });

	app.post('/login',function(req,res){
		//console.log(req.body)
		//console.log(req.params.id)
    	//res.render('login.html');    	
    	res.status(200).json(req.body);
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
    //세번째 API: POST addUser/:username
    app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });
    //네번째 API: PUT updateUser/:username
    app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });
    //마지막 API: DELETE deleteUser/:username
    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })

    })
    // LOGIN API
    app.get('/login/:ID/:PASSWORD', function(req, res){
        var sess;
        sess = req.session;        

		Crm_user.findOne({ID: ""+req.params.ID, PASSWORD: ""+req.params.PASSWORD, "delflag" : "N"}, function(err, crm_users){
			console.log("아이디:"+req.params.ID+"/ 비밀번호:"+req.params.PASSWORD );
	        if(err) return res.status(500).json({error: err});
	        if(crm_users.length === 0) return res.status(404).json({error: '잘못된 계정입니다.'});
	        sess.formid = crm_users["FORMID"];
	        console.log("session:"+sess);
	        console.log("crm_users:"+crm_users);
	        console.log("crm_users['FORMID']:"+crm_users["FORMID"]);
	        res.json(crm_users);
	    })

    });
    //LOGOUT API
    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    });

    // GET ALL BOOKS
    app.get('/api/books', function(req,res){
	    Book.find(function(err, books){
	        if(err) return res.status(500).send({error: 'database failure'});
	        res.json(books);
	    })
	});

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
	    Book.findOne({_id: req.params.book_id}, function(err, book){
	        if(err) return res.status(500).json({error: err});
	        if(!book) return res.status(404).json({error: 'book not found'});
	        res.json(book);
	    })
	});

    // GET BOOK BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
    	Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
	        if(err) return res.status(500).json({error: err});
	        if(books.length === 0) return res.status(404).json({error: 'book not found'});
	        res.json(books);
	    })
    });

    //GET crm_user list
    app.get('/api/crm_user/list/', function(req, res){
    	Crm_user.find(function(err, crm_users){
	        if(err) return res.status(500).send({error: 'database failure'});
	        res.json(crm_users);
	    })
    	
    });

    //GET crm_user list FORMID		ex)http://localhost:3000/api/crm_user/list/8
    app.get('/api/crm_user/list/:FORMID', function(req, res){
    	Crm_user.find({FORMID: ""+req.params.FORMID, "delflag" : "N"}, function(err, crm_users){
    		console.log("아이디:"+req.params.FORMID);
	        if(err) return res.status(500).json({error: err});
	        if(crm_users.length === 0) return res.status(404).json({error: '잘못된 아이디입니다.'});
	        res.json(crm_users);
	    })
    });

    //GET crm_user list FORMID 로그인 안해도 되는 부분 ex)http://localhost:3000/api/crm_user/list/리플/1111
    app.get('/api/crm_user/list/:ID/:PASSWORD', function(req, res){
    	Crm_user.find({ID: ""+req.params.ID, PASSWORD: ""+req.params.PASSWORD, "delflag" : "N"}, function(err, crm_users){
    		console.log("아이디:"+req.params.ID+"/ 비밀번호:"+req.params.PASSWORD );
	        if(err) return res.status(500).json({error: err});
	        if(crm_users.length === 0) return res.status(404).json({error: '잘못된 계정입니다.'});
	        res.json(crm_users);
	    })
    });
 
 	//GET crm_users_db list
    app.get('/api/crm_users_db/list/', function(req, res){
    	Crm_users_db.find(function(err, crm_users_db){
	        if(err) return res.status(500).json({error: err});	        
	        res.json(crm_users_db);
	    })
    });

    //GET crm_users_db list code	
    app.get('/api/crm_users_db/list/:code', function(req, res){
    	Crm_users_db.find({"data.code": req.params.code+" ", "delflag" : "N"}, function(err, crm_users_db){
    		//ex)"code" : "519 " 값에 띄어쓰기가 있으므로
    		console.log(req.params.code+" dd");
	        if(err) return res.status(500).json({error: err});
	        if(crm_users_db.length === 0) return res.status(404).json({error: 'book not found'});
	        res.json(crm_users_db);
	    })
    });

    // CREATE crm_users_db
    app.post('/api/crm_users_db', function(req, res){
        var crm_users_db = new Crm_users_db();
	    //book.title = req.body.title;
	    //book.author = req.body.author;
	    //book.published_date = new Date(req.body.published_date);
	    crm_users_db.data = req.body;

	    crm_users_db.save(function(err){
	        if(err){
	            console.error(err);
	            res.json({result: 0});
	            return;
	        }

	        res.json({result: 1, req : req.body, url : req.path });

	    });
    });

    // CREATE crm_user
    app.post('/api/crm_user', function(req, res){
        var crm_user = new Crm_user();
	    crm_user.FORMID = req.body.bcode;
	    crm_user.NAME = req.body.name;
	    crm_user.SITEURL = req.body.siteurl;
	    crm_user.CUSTOMSCRIPT = req.body.customscript;
	    crm_user.ALTID = req.body.altid;	        
	    crm_user.ID = req.body.id;
	    crm_user.PASSWORD = req.body.password;
	    crm_user.DESCRIPT = req.body.descript;

	    crm_user.save(function(err){
	        if(err){
	            console.error(err);
	            res.json({result: 0});
	            return;
	        }

	        res.json({result: 1});

	    });
    });

    // UPDATE THE BOOK
    app.put('/api/books/:book_id', function(req, res){
	    Book.findById(req.params.book_id, function(err, book){
	        if(err) return res.status(500).json({ error: 'database failure' });
	        if(!book) return res.status(404).json({ error: 'book not found' });

	        if(req.body.title) book.title = req.body.title;
	        if(req.body.author) book.author = req.body.author;
	        if(req.body.published_date) book.published_date = req.body.published_date;

	        book.save(function(err){
	            if(err) res.status(500).json({error: 'failed to update'});
	            res.json({message: 'book updated'});
	        });

	    });

	});

    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
        Book.remove({ _id: req.params.book_id }, function(err, output){
	        if(err) return res.status(500).json({ error: "database failure" });

	        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
	        if(!output.result.n) return res.status(404).json({ error: "book not found" });
	        res.json({ message: "book deleted" });
	        */

	        res.status(204).end();
	    })
    });
}