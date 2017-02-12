let startTime;
let highscoreValue;
let highscoreText;
let highscoreValueText;
let startButton;
let taskCaption;
let taskText;

let microphoneActive;
let orientationActive;
let motionActive;
let currentActive;
let lastActive;
let playing;
let variant;
let goalValue;
let startValue;

let motion;

let alpha;
let beta;
let gamma;

let averageLoudness;

let gameCounter;
let gamesPlayed;

let debug;

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", listenForOrientation);
}
if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", getAverageAcceleration);
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

  debug = 0;
}

function startGame() {
  startTime = new Date().getTime();
  startButton.style.visibility = "hidden";
  startNextGame();
}

function handleMicrophone() {
  if (currentActive == microphoneActive) {
    if (!playing) {
      console.log("Setting up microphone");
      playing = true;
      variant = Math.random() * 2;
      if (variant < 1) {
        setTextQuiet();
      } else {
        setTextLoud();
      }
    } else {
      if (variant < 1 && averageLoudness < 0.08) {
        variant = -1;
        startNextGame();
      } else if (variant < 2 && averageLoudness > 20) {
        variant = -1;
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

function handleOrientation() {
  if (currentActive == orientationActive) {
    if (!playing) {
      playing = true;
      variant = Math.random() * 3;
      goalValue = Math.round(Math.random() * 18 - 9) * 10;

      if (variant < 1) {
        startValue = alpha;
        setTextZAxis();
      } else if (variant < 2) {
        startValue = beta;
        setTextXAxis();
      } else {
        startValue = gamma;
        setTextYAxis();
      }
    } else {
      var difference;
      if (variant < 1) {
        difference = alpha - startValue;
      } else if (variant < 2) {
        difference = beta - startValue;
      } else {
        difference = gamma - startValue;
      }

      if (difference > goalValue - 5 && difference < goalValue + 5) {
        variant = -1;
        startNextGame();
      }
    }
  }

  function setTextXAxis() {
    var text;
    if (goalValue < 0) {
      text = "hinten"
    } else {
      text = "vorne"
    }
    taskCaption.innerHTML = "Neigen Sie das Gerät nach " + text + "!";
    taskText.innerHTML = "Neigen Sie das Gerät um " + goalValue + "° um die X-Achse."
  }

  function setTextYAxis() {
    var text;
    if (goalValue < 0) {
      text = "links"
    } else {
      text = "rechts"
    }
    taskCaption.innerHTML = "Neigen Sie das Gerät nach " + text + "!";
    taskText.innerHTML = "Neigen Sie das Gerät um " + goalValue + "° um die Y-Achse."
  }

  function setTextZAxis() {
    var text;
    if (goalValue < 0) {
      text = "rechts"
    } else {
      text = "links"
    }
    taskCaption.innerHTML = "Drehen Sie das Gerät nach " + text + "!";
    taskText.innerHTML = "Drehen Sie das Gerät um " + goalValue + "° um die Z-Achse."
  }
}

function handleMotion() {
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
      if (motion > debug) {
        debug = motion;
      }
      if (variant < 1 && motion < 9.5) {
        variant = -1;
        clearStorage();
        startNextGame();
      } else if (variant < 2 && motion > 15) {
        variant = -1;
        clearStorage();
        startNextGame();
      }
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
  currentActive = -1;
  var next = Math.random() * 3;
  gamesPlayed++;
  playing = false;

  if (gamesPlayed < gameCounter) {
      if (next <= motionActive && lastActive != motionActive) {
        currentActive = motionActive;
        handleMotion();
        lastActive = motionActive;
      } else if (next <= orientationActive && lastActive != orientationActive) {
        currentActive = orientationActive;
        handleOrientation();
        lastActive = orientationActive;
      } else if (lastActive != microphoneActive) {
        currentActive = microphoneActive;
        handleMicrophone();
        lastActive = microphoneActive;
      } else {
        currentActive = (lastActive + 1) % 3;
        if (currentActive == motionActive) {
          handleMotion();
        } else if (currentActive == orientationActive) {
          handleOrientation();
        } else {
          handleMicrophone();
        }
      }
  } else {
    endGame();
  }
}

function endGame() {
  var endTime = new Date().getTime();
  var timePlayed = (endTime - startTime) / 1000;
  gamesPlayed = -1;
  startButton.innerHTML = "Nochmal spielen";
  startButton.style.visibility = "visible";

  if (timePlayed < highscoreValue) {
    highscoreValue = timePlayed;
    setNewHighscore(timePlayed);
  } else {
    setNoNewHighscore();
  }

  function setNewHighscore(highscoreValue) {
      taskCaption.innerHTML = "Geschafft! Neuer Highscore!";
      taskText.innerHTML = "Sie haben eine neue Bestzeit aufgestellt, gratulation."
      highscoreValueText.innerHTML = highscoreValue + " Sekunden";
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

          averageLoudness = values / length;

          if (currentActive == microphoneActive) {
            handleMicrophone();
          }
        }
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

function listenForOrientation(event) {
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;

  if (currentActive == orientationActive) {
    handleOrientation();
  }
}

function getAverageAcceleration(event) {
  var deviceAcceleration = event.accelerationIncludingGravity;
  var x = deviceAcceleration.x;
  var y = deviceAcceleration.y;
  var z = deviceAcceleration.z;

  var vectorValue = Math.cbrt(x*x + y*y + z*z);
  var array = loadArray();
  var sumArray = addAndStore(array, vectorValue);
  motion = getAverage(sumArray);

  if (currentActive == motionActive) {
    handleMotion();
  }
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
