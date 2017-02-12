var startTime;
var highscoreValue;
var highscoreText;
var highscoreValueText;
var startButton;
var taskCaption;
var taskText;

let microphoneActive;
let orientationActive;
let motionActive;
var currentActive;
var playing;
var variant;
var goalValue;
var startValue;

let gameCounter;
var gamesPlayed;

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation);
}
if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", handleMotion);
}

function init() {
  highscoreValue = Number.MAX_SAFE_INTEGER;
  highscoreText = document.getElementById("highscoreText");
  highscoreValueText = document.getElementById("highscoreValueText");
  startButton = document.getElementById("startButton");
  taskCaption = document.getElementById("taskCaption");
  taskText = document.getElementById("taskText");

  microphoneActive = 3;
  orientationActive = 2;
  motionActive = 1;
  currentActive = 0;
  playing = false;

  gameCounter = 5;
  gamesPlayed = -1;
}

function startGame() {
  startTime = new Date().getTime();
  startButton.style.visibility = "hidden";
  startNextGame();
}

function handleMicrophone(averageLoudness) {
  if (currentActive == microphoneActive) {
    if (!playing) {
      playing = true;
      variant = Math.random() * 2;
      if (variant < 1) {
        setTextQuiet();
      } else {
        setTextLoud();
      }
    } else {
      highscoreValueText.innerHTML = "Loudness is: " + averageLoudness;
      if (variant < 1 && averageLoudness < 1) {
        startNextGame();
      } else if (variant < 2 && averageLoudness > 10) {
        startNextGame();
      }
    }
  }

  function setTextQuiet() {
    taskCaption.innerHTML = "Seien Sie ganz leise!"
    taskText.innerHTML = "Sie können auch versuchen das Microfon abzudecken."
  }

  function setTextLoud() {
    taskCaption.innerHTML = "Seien Sie ganz laut!"
    taskText.innerHTML = "Sie können auch einfach in das Mikrofon pusten, das ist vielleicht angebrachter."
  }
}

function handleOrientation(event) {
  if (currentActive == orientationActive) {
    if (!playing) {
      playing = true;
      variant = Math.random() * 3;
      goalValue = Math.round(Math.random() * 18 - 9) * 10;

      if (variant < 1) {
        startValue = event.alpha;
        setTextZAxis(goalValue);
      } else if (variant < 2) {
        startValue = event.beta;
        setTextXAxis(goalValue);
      } else {
        startValue = event.gamma;
        setTextYAxis(goalValue);
      }
    } else {
      var difference;
      highscoreValueText.innerHTML = "Device rotation difference is: " + difference;
      if (variant < 1) {
        difference = Math.abs(event.alpha - startValue);
      } else if (variant < 2) {
        difference = Math.abs(event.beta - startValue);
      } else {
        difference = Math.abs(event.gamma - startValue);
      }

      if (difference > goalValue - 5 && difference < goalValue + 5) {
        startNextGame();
      }
    }
  }

  function setTextXAxis(amount) {
    taskCaption.innerHTML = "Neigen Sie das Gerät! (vor/zurück)"
    taskText.innerHTML = "Neigen Sie das Gerät um " + amount + "° um die X-Achse."
  }

  function setTextYAxis() {
      taskCaption.innerHTML = "Neigen Sie das Gerät! (links/rechts)"
      taskText.innerHTML = "Neigen Sie das Gerät um " + goalValue + "° um die Y-Achse."
  }

  function setTextZAxis() {
    taskCaption.innerHTML = "Drehen Sie das Gerät!"
    taskText.innerHTML = "Drehen Sie das Gerät um " + goalValue + "° um die Z-Achse."
  }
}

function handleMotion(event) {
  if (currentActive == motionActive) {
    if (!playing) {
      playing = true;
      variant = Math.random() * 2;

      if (variant < 1) {
        setTextDontMove();
      } else {
        setTextMove();
      }
    } else {
        var average = getAverageAcceleration(event);
        highscoreValueText.innerHTML = "Motion average is: " + average;
        if (variant < 1 && average < 2) {
          startNextGame();
        } else if (variant < 2 && average > 20) {
          startNextGame();
        }
        clearStorage();
    }
  }

  function setTextDontMove() {
    taskCaption.innerHTML = "Halten Sie das Gerät still!";
    taskText.innerHTML = "Nervös? Dann können Sie das Gerät auch hinlegen.";
  }

  function setTextMove() {
    taskCaption.innerHTML = "Schütteln Sie das Gerät!";
    taskText.innerHTML = "Sie müssen stärker schütteln!";
  }

}

function startNextGame() {
  var next = Math.random() * 3;
  gamesPlayed++;
  playing = false;

  if (gamesPlayed < gameCounter) {
      if (next <= motionActive) {
        currentActive = motionActive;
      } else if (next <= orientationActive) {
        currentActive = orientationActive;
      } else {
        currentActive = microphoneActive;
      }
  } else {
    endGame();
  }
}

function endGame() {
  var endTime = new Date().getTime();
  var timePlayed = (endTime - startTime) / 1000;
  gamesPlayed = -1;
  startButton.style.visibility = "visible";
  startButton.value = "Nochmal spielen";

  if (timePlayed < highscoreValue) {
    highscoreValue = timePlayed;
    setNewHighscore();
  } else {
    setNoNewHighscore();
  }

  function setNewHighscore(highscoreValue) {
      taskCaption.innerHTML = "Geschafft! Neuer Highscore!";
      taskText.innerHTML = "Sie haben eine neue Bestzeit aufgestellt, gratulation."
      highscoreValueText.innerHTML = "" + highscoreValue;
      highscoreText.style.visibility = "visible";
  }

  function setNoNewHighscore() {
      taskCaption.innerHTML = "Leider zu langsam.";
      taskText.innerHTML = "Sie waren leider zu langsam, aber versuchen Sie es doch erneut."
  }

}

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
if (navigator.getUserMedia) {
  navigator.getUserMedia({
      audio: true
    },
    function(stream) {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = function() {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;

          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += (array[i]);
          }

          var averageLoudness = values / length;

          handleMicrophone(averageLoudness);
        }
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

function getAverageAcceleration(event) {
  var deviceAcceleration = event.accelerationIncludingGravity;
  var x = deviceAcceleration.x;
  var y = deviceAcceleration.y;
  var z = deviceAcceleration.z;

  var vectorValue = Math.sqrt(x*x + y*y + z*z);
  var array = loadArray();
  var sumArray = addAndStore(array, vectorValue);
  var average = getAverage(sumArray);

  return average;
}

function getAverage (array) {
  return array.reduce(function(a, b) {return a + b}) / array.length;
}

function addAndStore (array, number) {
  var length = array.length;
  if (length >= 10) {
    array.shift();
  }
  array.push(number);

  saveArray(array);

  return array;
}

function loadArray() {
  var array = localStorage.getItem("sumArray");
  if (array === null || array.length === 0) {
    var newArray = [0];
    localStorage.setItem("sumArray", JSON.stringify(newArray));
    return loadArray();
  } else {
    if (array) {
        return JSON.parse(array);
    }
  }
}

function saveArray(array) {
  localStorage.setItem("sumArray", JSON.stringify(array));
}

function clearStorage() {
  localStorage.removeItem("sumArray");
}
