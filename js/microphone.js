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

          storeNumber(average);
        }
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

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

function getAverage() {
  var sum = JSON.parse(localStorage.getItem("sum"));
  if (sum === null) {
    return 0;
  } else {
    var counter = JSON.parse(localStorage.getItem("counter"));
    result = sum / counter;

    document.getElementById("smellResult").innerHTML = result;
  }
}

function startAveraging() {
  // reset sum and counter
  localStorage.setItem("sum", JSON.stringify(0));
  localStorage.setItem("counter", JSON.stringify(0));

  console.log("recording");
  document.getElementById("smellResult").innerHTML = "Start Recording";
}
