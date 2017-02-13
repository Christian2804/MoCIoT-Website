var startTime;

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

      var text = document.getElementById("smellResult");

      javascriptNode.onaudioprocess = function() {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var values = 0;

          var length = array.length;
          for (var i = 0; i < length; i++) {
            values += (array[i]);
          }

          var average = values / length;
          var timeElapsed = new Date().getTime() - startTime;
          if (timeElapsed > 3000) {
            stopRecording();
          }

          if (recording) {
            storeNumber(average);
          }

        }
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

var recording = false;
var enoughData = 0;

function storeNumber(number) {
  var currentSum = JSON.parse(localStorage.getItem("sum"));
  if (currentSum === null) {
    localStorage.setItem("sum", JSON.stringify(number));
    localStorage.setItem("counter", JSON.stringify(1));
  } else {
    var newSum = currentSum + number;
    var newCounter = JSON.parse(localStorage.getItem("counter")) + 1;

    localStorage.setItem("sum", JSON.stringify(newSum));
    localStorage.setItem("counter", JSON.stringify(newCounter));
  }
}

function stopRecording() {
  var sum = JSON.parse(localStorage.getItem("sum"));
  if (sum === null) {
    return 0;
  } else {
    var counter = JSON.parse(localStorage.getItem("counter"));
    var buttonText = document.getElementById("restartButton").innerHTML;
    result = sum / counter;

    if (result < 10) {
      $("#smellResult").text("Das riecht nicht so gut");
    } else {
      $("#smellResult").text("Das riecht sehr gut")
    }

    buttonText = "Nochmal riechen!";
  }

  recording = false;
  $("#restartButton").css("visibility", "visible");
}

function startRecording() {
  // reset sum and counter
  localStorage.setItem("sum", JSON.stringify(0));
  localStorage.setItem("counter", JSON.stringify(0));

  enoughData = 0;
  recording = true;
  startTime = new Date().getTime();

  $("#smellResult").text("Ich rieche, bitte weiter puster...");
  $("#restartButton").css("visibility", "hidden");
}
