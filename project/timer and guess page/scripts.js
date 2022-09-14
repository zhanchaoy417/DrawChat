function load_drawing(){
  document.getElementById("drawing").src = "../resources/imgs/puppy.jpg"; // make this sql call with get
  let timer_spot = document.getElementById("timer_spot");
  let score_spot = document.getElementById("score_spot");
  let timer = document.createElement("div");
  timer.ClassName = "Timer";
  let score = document.createElement("div");
  timer.setAttribute(/*timer here*/);
  score.setAttribute(/*score here*/);
  timer_spot.appendChild(timer);
  score_spot.appendChild(score);
}

function check_guess(guesses,ans){
  var new_guess = document.getElementById("guess").value;
  if (new_guess == ans){
    guessed_right()
  }
  guesses.push(" " + new_guess);
  document.getElementById("guesses_list").innerHTML = guesses;
  document.getElementById("myForm").reset();
}

function guessed_right(){
  //switch pages of each user
  document.getElementById("correct_link").click();

  //award points to correct guesser
}