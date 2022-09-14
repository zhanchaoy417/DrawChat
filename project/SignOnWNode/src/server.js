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


//Post game code into table when 'start game' button pushed
app.post('/home/game_code', function(req, res) {
	var gameCode = Math.floor(Math.random() * (999999-100000) +100000);
  // Need to create new user - userID should auto increment, enter GameCode, null UserName userScore deafult 0
  // Need to enter userID in 'UsersInGame' in Games table, do I need a different post request? Or will this method work 
  var user_insert_statement = "INSERT INTO Users(GameCode, UserName) VALUES('" + gameCode + "', NULL)";
  var userId = "SELECT UserID FROM Users WHERE GameCode = '" + gameCode + "'";
  
  var code_insert_statement = "INSERT INTO Games(gameCode, UsersInGame) VALUES('" + gameCode + "', ['" + userId + "'])";
  // Apend user into users array in games table
  var user_into_array = "UPDATE table SET UsersInGame = array_append(UsersInGame, '" + userId + "')";
  
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
            userId: userId
        })
    })
    .catch(error => {
        req.flash('error', error);
        res.render('pages/pickUser1', {
            my_title: "Pick Username 1",
            gameCode: '',
            userId: ''
        })
    });
});


//Post username for user 1 when they enter username 
app.post('/pickUser1', function(req, res) {
  var gameCode = req.body.gameCode; //think this should work since last post
  var userId = req.body.userId;
  var userName = req.body.userName; //Comes from form they submit when enter username

  var insert_statement = "INSERT INTO Users(UserName) VALUES('" + userName + "') WHERE UserID = '" + userId + "' ";
  
	db.task('get-everything', task => {
				return task.batch([
					task.any(insert_statement),
				]);
			})
    .then(info => {
        res.render('pages/gameStart1',{
            my_title: "Game Start 1",
            // Can I return an array item of user names here 
            user: userName,
            gameCode: gameCode
        })
    })
    .catch(error => {
        req.flash('error', error);
        res.render('pages/gameStart1', {
            my_title: "Game Start 1",
            user: '',
            gameCode: gameCode
        })
    });
});

//add new user to users and games tables when they enter a game code
app.post('/enterCode/game_code', function(req, res) {
	var gameCode = req.body.gameCode;
  // Need to create new user - userID should auto increment, enter GameCode, null UserName userScore deafult 0
  // Need to enter userID in 'UsersInGame' in Games table, do I need a different post request? Or will this method work 
  var user_insert_statement = "INSERT INTO Users(GameCode, UserName) VALUES('" + gameCode + "', NULL)";
  var userId = "SELECT UserID FROM Users WHERE GameCode = '" + gameCode + "'";
  // Apend user into users array in games table
  var user_into_array = "UPDATE table SET UsersInGame = array_append(UsersInGame, '" + userId + "')";
  
	db.task('get-everything', task => {
				return task.batch([
					task.any(user_insert_statement),
          task.any(userId),
          task.any(user_into_array)
				]);
			})
    .then(info => {
        res.render('pages/pickUser2',{
            my_title: "Pick Username 2",
            gameCode: gameCode,
            userId: userId
        })
    })
    .catch(error => {
        req.flash('error', error);
        res.render('pages/pickUser2', {
            my_title: "Pick Username 2",
            gameCode: '',
            userId: ''
        })
    });
});

//Post username for other users when they enter userName
app.post('/pickUser2', function(req, res) {
  var gameCode = req.body.gameCode; //think this should work since last post
  var userId = req.body.userId;
  var userName = req.body.userName; //Comes from form they submit when enter username

  var insert_statement = "INSERT INTO Users(UserName) VALUES('" + userName + "') WHERE UserID = '" + userId + "' ";
  
	db.task('get-everything', task => {
				return task.batch([
					task.any(insert_statement),
				]);
			})
    .then(info => {
        res.render('pages/gameStart2',{
            my_title: "Game Start 2",
            // Can I return an array item of user names here 
            user: userName,
            gameCode: gameCode
        })
    })
    .catch(error => {
        req.flash('error', error);
        res.render('pages/gameStart2', {
            my_title: "Game Start 2",
            user: '',
            gameCode: gameCode
        })
    });
});

//In general do I need seperate get requests to the values I rendered from the post request on the prior pages
