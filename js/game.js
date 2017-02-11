var motionAvailable;
var orientationAvailable;
var startTime;
var highscore;

let microphoneActive = 3;
let orientationActive = 2;
let motionActive = 1;

let gameCounter = 5;
var gamesPlayed = 0;

if (window.DeviceOrientationEvent) {
  orientationAvailable = true;
}
if (window.DeviceMotionEvent) {
  motionAvailable = true;
}



function startGame() {
  startTime = new Date().getTime();
}

function startMicrophone() {

}

function startOrientation() {

}

function startMotion() {

}

function startNextGame() {
  var next = Math.random() * 3;
  gamesPlayed++;

  if (gamesPlayed < gameCounter) {
      if (next <= motionActive && motionAvailable) {
        startMotion();
      } else if (next <= orientationActive && orientationAvailable) {
        startOrientation();
      } else {
        startMicrophone();
      }
  } else {
    endGame();
  }
}

function endGame() {
  var endTime = new Date().getTime();
  var timePlayed = (endTime - startTime) / 1000;


}
