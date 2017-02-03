if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

function handleOrientation(event) {
  alpha = event.alpha;

  var text = document.getElementById("longText");

  text.style.transform = "rotate(" + alpha + "deg)";

}
