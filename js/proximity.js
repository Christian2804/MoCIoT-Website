if (window.DeviceProximityEvent) {
  window.addEventListener("deviceproximity", deviceProximityListener);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

function deviceProximityListener(event) {
  var value = event.value;
  var max = event.max;
  var min = event.min;

  document.getElementById("test").innerHTML = "Min: " + min + " Max: " + max + " current Value: " + value;
}
