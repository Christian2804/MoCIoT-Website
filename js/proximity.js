if (window.DeviceProximityEvent) {
  window.addEventListener("deviceproximity", deviceProximityListener);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
  disableText();
}

function deviceProximityListener(event) {
  var value = event.value;
  var max = event.max;
  var min = event.min;

  document.getElementById("test").innerHTML = "Min: " + min + " Max: " + max + " current Value: " + value;
}

function disableText() {
  document.getElementById("text").innerHTML = "Es tut uns leider, " +
        "aber hier können wir Ihnen nichts demonstrieren. <br/>" +
        "Schauen Sie doch bei einem anderen Sensor vorbei";
}
