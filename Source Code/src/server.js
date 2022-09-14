// Through Line 57 coppied from Lab 10

/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk'); // For push/pull images to S3 bucket

aws.config.update({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
});

const s3 = new aws.S3();


/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory
app.use('/draw', express.static(__dirname + '/views/pages/draw/build'));



app.get('/', function(req, res) {
	res.render('pages/home',{
        my_title:"Home Page"
	});
});

app.post('/home/game_code', function(req, res) {
	var gameCode = Math.floor(Math.random() * (999999-100000) +100000);
  // Need to create new user - userID should auto increment, enter GameCode, null UserName userScore deafult 0
  // Need to enter userID in 'UsersInGame' in Games table, do I need a different post request? Or will this method work
  var user_insert_statement = "INSERT INTO Users(GameCode, UserName) VALUES(" + gameCode + ", NULL)";
  var userId = "SELECT UserID FROM Users WHERE GameCode = " + gameCode + "";

  //var code_insert_statement = "INSERT INTO Games(gameCode, UsersInGame) VALUES('" + gameCode + "', ['" + userId + "'])";
  var code_insert_statement = "INSERT INTO Games(gameCode) VALUES(" + gameCode + ")";
  // Apend user into users array in games table
 // var user_into_array = "UPDATE table SET UsersInGame = array_append(UsersInGame, '" + userId + "')";

	db.task('get-everything', task => {
				return task.batch([
					task.any(user_insert_statement),
          task.any(userId),
          task.any(code_insert_statement)
				]);
			})
    .then(info => {
        res.render('pages/pickUser1',{
            my_title: "Pick Username 1",
            gameCode: gameCode,
            userId: info[1][0].userid
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/pickUser1', {
            my_title: "Pick Username 1",
            gameCode: '',
            userId: ''
        })
    });
});

//Post username for user 1 when they enter username
app.post('/gameStart1', function(req, res) {

  var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.body.userid);
  var userName = req.body.fname; //Comes from form they submit when enter username

  var update_statement = "UPDATE Users SET UserName = '" + userName + "' WHERE UserID = '" + userId + "' ";
  
  var users = "SELECT UserName FROM Users WHERE gamecode = '" + gameCode + "'";
  // var outUrl = '/gameStart1/?userId=' + req.body.userid;
  // console.log(outUrl);
  var pics = ["castle","spider","burger","flower","camera","firework","elephant","pants","cheese","donut"];
  var num = Math.floor(Math.random()*10);
  var pic = pics[num];
  var picName = "UPDATE Games SET DrawingName = '" + pic + "' WHERE GameCode = '" + gameCode + "' ";
  



	db.task('get-everything', task => {
				return task.batch([
					task.any(update_statement),
                    task.any(users),
                    task.any(picName)
				]);
			})
    .then(info => {
        res.render('pages/gameStart1',{
            my_title: "Game Start 1",
            // Can I return an array item of user names here
            userId: userId,
            users: 0,
            gameCode: gameCode,
            pic: pic
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/gameStart1', {
            my_title: "Game Start 1",
            userId: '',
            user: '',
            gameCode: '',
            pic: ''
        })
    });
});

//Reload userName
app.get('/gameStart1/refresh', function(req, res) {

  // console.log(req);
  // var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.query.userid);
  var gameCode = "SELECT GameCode FROM Users WHERE userID = '" + userId + "'";
  var update_drawn = "UPDATE Users SET HasDrawn = '1' WHERE UserID = '" + userId + "' ";

  
  //
	db.task('get-everything', task => {
				return task.batch([
					task.any(gameCode),
                    task.any(update_drawn)
				]);
			})
      .then(info => {
            var GameCode = info[0][0].gamecode;

            var users = "SELECT UserName FROM Users WHERE gamecode = '" + GameCode + "'";
            var picName = "SELECT DrawingName FROM Games WHERE gamecode = '" + GameCode + "'";

              db.task('get-everything', task => {
                return task.batch([
                  task.any(users),
                  task.any(picName)
                ]);
              })
            .then(info => {
                console.log(info);
                  res.render('pages/gameStart1',{
                      my_title: "Game Start 1",
                      // Can I return an array item of user names here
                      users: info[0],
                      userId: userId,
                      gameCode: GameCode,
                      pic: info[1][0].drawingname
                  })
              })
              .catch(error => {
                  // req.flash('error', error);
                  res.render('pages/gameStart1', {
                      my_title: "Game Start 1",
                      users: '',
                      userId: '',
                      gameCode: '',
                      pic: ''
                  })
              });
        })


});


// create userId when joinGame is hit
app.post('/home/new_user', function(req, res) {
  var user_insert_statement = "INSERT INTO Users(UserName) VALUES('temp')";
  // This means two people cant join at once
  var userId = "SELECT UserID FROM Users WHERE UserName = 'temp'";

	db.task('get-everything', task => {
				return task.batch([
					task.any(user_insert_statement),
          task.any(userId),
				]);
			})
    .then(info => {
        res.render('pages/enterCode',{
            my_title: "Enter Code",
            userId: info[1][0].userid
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/enterCode', {
            my_title: "Enter Code",
            userId: ''
        })
    });
});

// Associate userId with game code
app.post('/enterCode/enter_code', function(req, res) {
  var userId = parseInt(req.body.userid);
  var gameCode = parseInt(req.body.code);

  var user_insert_statement = "UPDATE Users SET GameCode = '" + gameCode + "' WHERE UserID = '" + userId + "' ";

	db.task('get-everything', task => {
				return task.batch([
					task.any(user_insert_statement),
				]);
			})
    .then(info => {
        res.render('pages/pickUser2',{
            my_title: "User 2",
            gameCode: gameCode,
            userId: userId
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/pickUser2', {
            my_title: "User 2",
            gameCode: '',
            userId: ''
        })
    });
});

//Post username for other users when they enter username
app.post('/gameStart2', function(req, res) {

  var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.body.userid);
  var userName = req.body.fname; //Comes from form they submit when enter username

  var update_statement = "UPDATE Users SET UserName = '" + userName + "' WHERE UserID = '" + userId + "' ";
  var users = "SELECT UserName FROM Users WHERE gamecode = '" + gameCode + "'";

	db.task('get-everything', task => {
				return task.batch([
					task.any(update_statement),
          task.any(users)
				]);
			})
    .then(info => {
        res.render('pages/gameStart2',{
            my_title: "Game Start 2",
            // Can I return an array item of user names here
            users: 0,
            userId: userId,
            gameCode: gameCode
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/gameStart2', {
            my_title: "Game Start 2",
            user: '',
            userId: '',
            gameCode: ''
        })
    });
});

//Reload userName
app.get('/gameStart2/refresh', function(req, res) {

  // console.log(req);
  // var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.query.userid);
  var gameCode = "SELECT GameCode FROM Users WHERE userID = '" + userId + "'";
  //
	db.task('get-everything', task => {
				return task.batch([
					task.any(gameCode)
				]);
			})
      .then(info => {
            var GameCode = info[0][0].gamecode;

            var users = "SELECT UserName FROM Users WHERE gamecode = '" + GameCode + "'";

              db.task('get-everything', task => {
                return task.batch([
                  task.any(users)
                ]);
              })
            .then(info => {
                // console.log(info);
                  res.render('pages/gameStart2',{
                      my_title: "Game Start 2",
                      // Can I return an array item of user names here
                      users: info[0],
                      userId: userId,
                      gameCode: GameCode
                  })
              })
              .catch(error => {
                  // req.flash('error', error);
                  res.render('pages/gameStart2', {
                      my_title: "Game Start 2",
                      users: '',
                      userId: '',
                      gameCode: ''
                  })
              });
        })


});


app.post('/gameStart1/beginGame', function(req, res) {

  var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.body.userid);

  var update_statement = "UPDATE Games SET GameStarted = '1' WHERE GameCode = '" + gameCode + "' ";


	db.task('get-everything', task => {
				return task.batch([
					task.any(update_statement),
				]);
			})
    .then(info => {
        res.render('draw',{
            my_title: "Drawing",
            // Can I return an array item of user names here
            userId: userId,
            gameCode: gameCode
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/drawing', {
            my_title: "Drawing",
            userId: '',
            gameCode: ''
        })
    });
});

// app.get('/gameStart2/gameStarted', function(req, res) {

//   var gameCode = parseInt(req.body.GameCode); //think this should work since last post
//   var userId = parseInt(req.body.userid);

//   var gameStart = "select GameStarted from Games WHERE GameCode = '" + gameCode + "' ";

// 	db.task('get-everything', task => {
// 				return task.batch([
// 					task.any(gameStart)
// 				]);
// 			})
//     .then(info => {
//         res.render('pages/gameStart2',{
//             // Can I return an array item of user names here
//             userId: userId,
//             gameCode: gameCode,
//             yes: info[0][0].GameStarted
//         })
//     })
//     .catch(error => {
//         // req.flash('error', error);
//         res.render('pages/drawing', {
//             my_title: "Drawing",
//             userId: '',
//             gameCode: ''
//         })
//     });
// });

app.post('/gameStart2/beginGame', function(req, res) {

  var gameCode = parseInt(req.body.GameCode); //think this should work since last post
  var userId = parseInt(req.body.userid);

  var picName = "SELECT DrawingName FROM Games WHERE gamecode = '" + gameCode + "'";

	db.task('get-everything', task => {
				return task.batch([
					task.any(picName),
				]);
			})
    .then(info => {
        res.render('pages/guess',{
            my_title: "Guessing",
            // Can I return an array item of user names here
            userId: userId,
            gameCode: gameCode,
            correct: info[0][0].drawingname
        })
    })
    .catch(error => {
        // req.flash('error', error);
        res.render('pages/drawing', {
            my_title: "Drawing",
            userId: '',
            gameCode: '',
            correct: ''
        })
    });
});





app.get('/guess/update_guesser_page', function(req, res) {
	var game_info =  "SELECT * FROM Games WHERE Game_Code='" + req.game_code + "';"; //sql for getting game info
	db.task('get-everything', task => {
        return task.batch([
            task.any(game_info),
        ]);
    })
    .then(info => {
    	res.render('guess',{
        users: info[0][1],
				current_image: info[0][2],
        winner: info[0][4]
			})
    })
    .catch(err => {
        console.log('error getting game info', err);
    });
});

/* determine whether to change drawers page */
app.get('/game_end/update_drawer_page', function(req, res) {
  var game_code = req.body.game_code; //game code of user's game
	var game_info =  "SELECT * FROM Games WHERE Game_Code=" + game_code + ";"; //sql for getting game info
	db.task('get-everything', task => {
        return task.batch([
            task.any(game_info),
        ]);
    })
    .then(info => {
    	res.render('draw',{
        users: info[0][1],
				winner: info[0][4]
			})
    })
    .catch(err => {
        console.log('error getting game info', err);
    });
});

/* get score of user */
app.get('/guess/user_score', function(req, res) {
  var game_code = req.body.game_code; //game code of user's game
  var user_id = req.body.userId;
	var game_info =  "SELECT UserScore FROM Users WHERE Game_Code=" + game_code + " AND UserID=" + user_id + ";"; //sql for getting game info
	db.task('get-everything', task => {
        return task.batch([
            task.any(game_info),
        ]);
    })
    .then(info => {
    	res.render('game_over',{
        score: info[0],
			})
    })
    .catch(err => {
        console.log('error getting game info', err);
    });
});

/* determine scores at game_over */
app.get('/game_over/scores', function(req, res) {
  var game_code = req.body.game_code; //game code of user's game
	var game_info =  "SELECT UserName, UserScore FROM Users WHERE Game_Code=" + game_code + ";"; //sql for getting game info
	db.task('get-everything', task => {
        return task.batch([
            task.any(game_info),
        ]);
    })
    .then(info => {
    	res.render('game_over',{
        data: info[0],
			})
    })
    .catch(err => {
        console.log('error getting game info', err);
    });
});

/* determine final winner */
app.get('/draw/winner', function(req, res) {
  var game_code = req.body.game_code; //game code of user's game
	var game_info =  "SELECT UserName, MAX(UserScore) FROM Users WHERE Game_Code=" + game_code + " GROUP BY UserName;"; //sql for getting game info
	db.task('get-everything', task => {
        return task.batch([
            task.any(game_info),
        ]);
    })
    .then(info => {
    	res.render('game_end',{
        winning_user: info[0][0],
			})
    })
    .catch(err => {
        console.log('error getting game info', err);
    });
});

//posts
/* when user1 creates game */
app.post('/sign_on/create_game', function(req, res) {
  var game_code = req.body.game_code;
  var user_name = req.body.user_name;
  var blank_image = 'path_of_blank_image';
  var zero_time = Date.now();
	var insert_games = "INSERT INTO Games (GameCode,UsersInGame,CurrentImage,ImageTimeStamp) VALUES('" + game_code + "','" + user_name + "','" + blank_image + "'," + zero_time + ");"; //sql for adding game to games table
	var insert_users = "INSERT INTO Users(GameCode,UserName,UserScore) VALUES('" + game_code + "','" + user_name + "',0);"; //sql for adding user to users table

	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_games),
            task.any(insert_users)
        ]);
    })
    .then(info => {
    	res.render('draw',{
			})
    })
    .catch(err => {
        console.log('error updating database', err);
    });
});

/* when users join game */
app.post('/sign_on/join_game', function(req, res) {
  var game_code = req.body.game_code;
  var user_name = req.body.user_name;
  var user_names = req.body.user_names + user_name;
	var update_games = "UPDATE Games SET UsersInGame = '" + user_names + "' WHERE GameCode = '" + game_code + "';"; //sql for updating users in games table
	var insert_users = "INSERT INTO Users(GameCode,UserName,UserScore) VALUES('" + game_code + "','" + user_name + "',0);"; //sql for adding user to users table

	db.task('get-everything', task => {
        return task.batch([
            task.any(update_games),
            task.any(insert_users)
        ]);
    })
    .then(info => {
    	res.render('guess',{
			})
    })
    .catch(err => {
        console.log('error updating database', err);
    });
});

/* when image updates */
app.post('/draw/update_image', function(req, res) {
    console.log("/draw/update_image hit");
    var game_code = req.body.game_code;
    var img_loc = "store/" + game_code + "/image.svg";
    var svg_data = new Buffer(req.body.svg, 'base64').toString('utf-8'); //Decode image data
    var current_time = new Date().toISOString();
	//var update_games = "UPDATE Games SET CurrentImage = '" + img_loc + "', ImageTimeStamp = " + current_time + " WHERE GameCode = '" + game_code + "';"; //sql for updating image in games table
    var update_games = "UPDATE Games SET CurrentImage = '" + img_loc + " WHERE GameCode = '" + game_code + "';"; //sql for updating image in games table

    //Forward data to S3 bucket for storage
    var file_name = game_code + ".svg";
    var s3_params = {
        Bucket: "draw-chat-csci3308",
        Key: file_name,
        Body: svg_data
    };

    s3.upload(s3_params, function (err, data) {
        if(err) {
            console.log("Error occured during upload to S3");
            console.error(err);
            res.send(err);
        }

        if(data) {
            console.log("Uploaded in: " + data.Location);
            res.send(200);
        }
    });
});

// Forward image data from S3 to client
app.get('/draw/image/:game_code', function(req, res) {
    var game_code = req.params.game_code;
    var file_name = game_code;
    var s3_params = {
        Bucket: "draw-chat-csci3308",
        Key: file_name
    };

    console.log("Retreiving " + JSON.stringify(s3_params));
    s3.getObject(s3_params, function (err, data) {
        if(err) {
            console.log("Error occured while fetching S3 object.");
            console.error(err);
            res.send(err);
            return;
        }

        if(data) {
            res.writeHead(200, {
              'Content-Disposition': `attachment; filename="${file_name}"`,
              'Content-Type': 'image/svg+xml',
            });

            res.end(data.Body);
        }
    });
});

/* when game ends */
app.get('/after', function(req, res) {

  var userId = req.query.user_id;
  var gameCode = req.query.game_code;
  var blank_image = '/draw/image/000000'
  var zero_time = Date.now();
  //var update_users = "UPDATE Users SET UserScore = " + new_score + " WHERE UserID = '" + userId + "';";
//	var update_games = "UPDATE Games SET CurrentImage = '" + blank_image + "', ImageTimeStamp = " + zero_time + " WHERE GameCode = '" + gameCode + "';"; //sql for updating image in games table

//   db.task('get-everything', task => {
//         return task.batch([
//             task.any(update_users),
//             task.any(update_games)
//         ]);
//     })
//     .then(info => {
    	res.render('pages/after',{
        my_title: "End",
        userId: userId,
        gameCode: gameCode
			})
    // })
    // .catch(err => {
    //     console.log('error updating database', err);
    // });
});

app.post('/guess/endGuess', function(req, res) {
    //console.log(req.body)
    var userId = req.body.userid;
    var gameCode = req.body.GameCode;
    var score = req.body.scoreIn;
    var update_score = "UPDATE Users SET UserScore = UserScore + " + score + " WHERE UserID = '" + userId + "';";
  //	var update_games = "UPDATE Games SET CurrentImage = '" + blank_image + "', ImageTimeStamp = " + zero_time + " WHERE GameCode = '" + gameCode + "';"; //sql for updating image in games table
  
    db.task('get-everything', task => {
          return task.batch([
              task.any(update_score),
          ]);
      })
      .then(info => {
          res.render('pages/after',{
          my_title: "End",
          userId: userId,
          gameCode: gameCode
              })
      })
      .catch(err => {
          console.log('error updating database', err);
      });
  });

  // display scores when game ends
  app.post('/after/see_scores', function(req, res) {
    var game_code = req.body.gameCode;
      var scores = "SELECT * FROM Users WHERE GameCode = '"+ game_code +"'"; 
  
      db.task('get-everything', task => {
          return task.batch([
              task.any(scores),
          ]);
      })
      .then(info => {
          console.log(info)
        res.render('pages/scores',{
            my_title: "Game Over",
            data: info[0]
                })
      })
      .catch(err => {
          console.log('error updating database', err);
      });
  });

// /* when games end */
// app.get('/end_games', function(req, res) {
//   var game_code = req.body.game_code;
//   var update_users = "DELETE FROM Users WHERE GameCode = '" + game_code + "';"; //sql for deleting user from table
//   var update_games = "DELETE FROM Games WHERE GameCode = '" + game_code + "';"; //sql for deleting game from table
//   db.task('get-everything', task => {
//         return task.batch([
//             task.any(update_users),
//             task.any(update_games)
//         ]);
//     })
//     .then(info => {
//     	res.render('game_end',{
//         my_title: "Game End",
//         userId: userId,
//         gameCode: gameCode
// 			})
//     })
//     .catch(err => {
//         console.log('error updating database', err);
//     });
// });

// /* get max user score */
// app.get('/max_user_score', function(req, res) {
//   var game_code = req.body.game_code;
//   var game_info =  "SELECT MAX(UserScore) FROM Users WHERE Game_Code=" + game_code + ";"; //sql for getting game info
//   db.task('get-everything', task => {
//         return task.batch([
//             task.any(game_info)
//         ]);
//     })
//     .then(info => {
//     	res.render('game_over',{
//         my_title: "Game Over",
//         userId: userId,
//         gameCode: gameCode,
//         data: info[0][0]
// 			})
//     })
//     .catch(err => {
//         console.log('error updating database', err);
//     });
// });

/* restart game */
app.post('/after/nextRound', function(req, res) {

    var gameCode = req.body.gameCode; //think this should work since last post
    var userId = parseInt(req.body.userId);
    var next_drawerId = "SELECT userId FROM Users WHERE HasDrawn = '0' AND gamecode = '" + gameCode + "' LIMIT 1;";
    var users = "SELECT UserName FROM Users WHERE gamecode = '" + gameCode + "';";
    var pics = ["castle","spider","burger","flower","camera","firework","elephant","pants","cheese","donut"];
    var num = Math.floor(Math.random()*10);
    var pic = pics[num];
    var picName = "UPDATE Games SET DrawingName = '" + pic + "' WHERE GameCode = '" + gameCode + "' ;";
    //
      db.task('get-everything', task => {
                  return task.batch([
                      task.any(next_drawerId),
                      task.any(users),
                      task.any(picName)
                  ]);
              })
        .then(info => {
            console.log(info)
              var Id = parseInt(info[0][0].userid);

              if(userId === Id){

                res.render('pages/gameStart1',{
                    my_title: "Game Start 1",
                    // Can I return an array item of user names here
                    users: info[1],
                    userId: userId,
                    gameCode: gameCode,
                    pic: pic
                })

              }
              else{
                res.render('pages/gameStart2',{
                    my_title: "Game Start 2",
                    // Can I return an array item of user names here
                    users: info[1],
                    userId: userId,
                    gameCode: gameCode

              })
            }
            });
  
  
  
  });


//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
