const Start_point = 280; /* position that timer start*/ 
const warning_sign = 15;
const alert_sign = 5; 

/* scorer*/
const score=0;

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
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    pass_time = pass_time += 1;
    remain_time = time - pass_time;
    document.getElementById("base-timer-label").innerHTML = formatTime(
        remain_time
    
    );

    if( remain_time ==15){timerStop()
        document.getElementById("score_spot").innerHTML = "score:"+( 100+remain_time*10);
    }
  
    setCircleDasharray();
    setRemainingPathColor( remain_time);

    /* stop at 0*/
    if ( remain_time === 0) {
      timerStop();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
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