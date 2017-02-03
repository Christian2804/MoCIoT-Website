window.addEventListener("devicemotion", handleDeviceMotion, true);

function handleDeviceMotion(event) {
  var text = document.getElementById("scalingText");
  var fontSize = text.style.fontSize;

  var deviceAcceleration = event.acceleration;
  var x = deviceAcceleration.x;
  var y = deviceAcceleration.y;
  var z = deviceAcceleration.z;

  console.log("x is:" + x + " y is: " + y + " z is: " + z);

  var sumArray = Math.sqrt(x*x + y*y + z*z);
  var array = loadArray();
  var sumArray = addAndStore(array, sumArray);
  var average = getAverage(sumArray);

  if (average > 30) {
    fontSize = "30px";
  } else if (average > 20) {
    fontSize = "20px";
  } else {
    fontSize = "10px";
  }

  text.innerHTML = "average is: " + average;
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
  var test = [122];
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
