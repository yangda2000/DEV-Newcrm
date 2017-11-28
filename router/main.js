module.exports = function(app, fs, Book, Gamst)
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
    app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;        

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);            
            var username = req.params.username;
            var password = req.params.password;
            //console.log(users[username]);
            var result = {};
            if(!users[username]){
                // USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                console.log(sess);
                res.json(result);

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
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

    // CREATE BOOK
    app.post('/api/books', function(req, res){
        var book = new Book();
	    book.title = req.body.title;
	    book.author = req.body.author;
	    //book.published_date = new Date(req.body.published_date);
	    book.noschema = req.body;

	    book.save(function(err){
	        if(err){
	            console.error(err);
	            res.json({result: 0});
	            return;
	        }

	        res.json({result: 1, req : req.body});

	    });
    });

    // CREATE GAMST
    app.post('/api/gamsts', function(req, res){
        var gamst = new Gamst();
	    gamst.title = req.body.title;
	    gamst.author = req.body.author;
	    gamst.published_date = new Date(req.body.published_date);
	    gamst.noschema = req.body.noschema;

	    gamst.save(function(err){
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