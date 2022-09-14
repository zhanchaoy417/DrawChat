
// var express = require('express'); //Ensure our express framework has been added
// var app = express();
// var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
// app.use(bodyParser.json());              // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// //Create Database Connection
// var pgp = require('pg-promise')();

// /**********************
//   Database Connection information
//   host: This defines the ip address of the server hosting our database.
// 		We'll be using `db` as this is the name of the postgres container in our
// 		docker-compose.yml file. Docker will translate this into the actual ip of the
// 		container for us (i.e. can't be access via the Internet).
//   port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
//   database: This is the name of our specific database.  From our previous lab,
// 		we created the football_db database, which holds our football data tables
//   user: This should be left as postgres, the default user account created when PostgreSQL was installed
//   password: This the password for accessing the database. We set this in the
// 		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
// **********************/
// const dev_dbConfig = {
// 	host: 'db',
// 	port: 5432,
// 	database: process.env.POSTGRES_DB,
// 	user:  process.env.POSTGRES_USER,
// 	password: process.env.POSTGRES_PASSWORD
// };

// /** If we're running in production mode (on heroku), the we use DATABASE_URL
//  * to connect to Heroku Postgres.
//  */
// const isProduction = process.env.NODE_ENV === 'production';
// const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// // Heroku Postgres patch for v10
// // fixes: https://github.com/vitaly-t/pg-promise/issues/711
// if (isProduction) {
//   pgp.pg.defaults.ssl = {rejectUnauthorized: false};
// }

// const db = pgp(dbConfig);

// // set the view engine to ejs
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '../../views');
// app.use(express.static(__dirname + '../../'));//This line is necessary for us to use relative paths and access our resources directory


// function openGuessing(){
//     var gameCode = document.getElementById("GameCode").value;
//     var userId = document.getElementById("userid").value;
//     console.log(gameCode);
//     console.log(userId);

//     setInterval(() =>{

//     console.log(gameCode);
//      console.log(userId);

//     var gameStart = "select GameStarted from Games WHERE GameCode = '" + gameCode + "' ";

//     db.task('get-everything', task => {
//         return task.batch([
//             task.any(gameStart),
//         ]);
//     })
//     .then(info => {
//         var started = info[0][0].gameStart;
//         if(started = 1){


//             app.get('/gameStart2/beginGame', function(req, res) {
//                 var userId = parseInt(req.query.userid);
//                 var gameCode = "SELECT GameCode FROM Users WHERE userID = '" + userId + "'";

//                             res.render('pages/guess.html',{
//                                     my_title: "Guessing",
//                                     // Can I return an array item of user names here
//                                     userId: userId,
//                                     gameCode: gameCode
//                              })
//                       })


//           }
//         });

//     }, 1000);


//   };


// function isGameStarted(){
//   setInterval(() =>{
//   var yes = 0;
//   document.getElementById("is_game_started").click();
//   if (yes == 1){
//     document.getElementById("start_game").click();
//   }
//   }, 1000);
// };



function get_word(){
  
  var num = Math.floor(Math.random()*10);
  var pic = pics[num];
  return pic;
}

function load_drawing(){
  setInterval(() =>{
      //console.log(game_code);
      document.getElementById("drawing").src = "/draw/image/"+ game_code + ".svg?" + new Date().getTime();
     }, 1000);
}

function check_guess(guesses,ans){
  var new_guess = document.getElementById("guess").value;
  if (new_guess == ans){
    guessed_right_tag = 1;
  }
  guesses.push(" " + new_guess);
  document.getElementById("guesses_list").innerHTML = guesses;
  document.getElementById("myForm").reset();
}


function check_thresh(){
  document.getElementById("check_scores").click();
  if (data>1000){
    document.getElementsById("end_games").click();
  }
}

const Start_point = 280; /* position that timer start*/
const warning_sign = 15;
const alert_sign = 5;

/* scorer*/
var score=0;

const color = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    sign: warning_sign
  },
  alert: {
    color: "red",
    sign: alert_sign
  }
};

const time = 30;
let pass_time= 0;
let  remain_time = time;
let timerInterval = null;
let remainingPathColor = color.info.color;
var guessed_right_tag = 0;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="23"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="timer_character">${formatTime(
    remain_time
  )}</span>
  <span id="score"  class="timer_character"> </span>
</div>
`;

startTimer();

function timerStop() {
  //document.getElementById("game_over").click();
  //document.getElementById("endRound").click();
  setTimeout(() => {document.getElementById("endRound").click()}, 5000);
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    pass_time = pass_time += 1;
    remain_time = time - pass_time;
    document.getElementById("base-timer-label").innerHTML = formatTime(remain_time);
    if(remain_time ==0){timerStop()}
    else if(guessed_right_tag){
      score += 100+remain_time*10;
      //post score to user
      timerStop();
    }
    document.getElementById("score_spot").innerHTML = "Score: "+(score);
    document.getElementById("scoreIn").value = score;

    // setTimeout(() => {document.getElementById("endRound").click()}, 5000);

    setCircleDasharray();
    setRemainingPathColor( remain_time);
  }, 1000);
}

function formatTime(time) {
  let seconds = time % 60;
  return `${seconds}`;
}

/* path color*/
function setRemainingPathColor( remain_time) {
  const { alert, warning, info } = color;
  if ( remain_time <= alert.sign) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if ( remain_time <= warning.sign) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction =  remain_time/ time;
  return rawTimeFraction - (1 / time) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * Start_point
  ).toFixed(0)} 280`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
