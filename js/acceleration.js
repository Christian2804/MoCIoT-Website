if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", handleDeviceMotion, true);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

let max = 0;
let startAcceleration = -1;

function handleDeviceMotion(event) {
  var text = $("#scalingText");

  var deviceAcceleration = event.accelerationIncludingGravity;
  var x = deviceAcceleration.x;
  var y = deviceAcceleration.y;
  var z = deviceAcceleration.z;

  var vectorValue = Math.cbrt(x*x + y*y + z*z);
  var array = loadArray();
  var sumArray = addAndStore(array, vectorValue);
  var average = getAverage(sumArray);
  var difference = average - startAcceleration;

  if (difference > 2) {
    text.css("font-size", "x-large");
  } else if (difference > 1) {
    text.css("font-size", "large")
  } else {
    text.css("font-size", "medium")
  }
}

function getAverage (array) {
  return array.reduce(function(a, b) {return a + b}) / array.length;
}

function addAndStore (array, number) {
  var length = array.length;
  if (length >= 20) {
    array.shift();
    if (startAcceleration == -1) {
      startAcceleration = getAverage(array);
    }
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
