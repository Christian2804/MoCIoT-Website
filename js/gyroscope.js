if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

function handleOrientation(event) {
  var alpha = event.alpha * Math.PI / 180;

  var text = document.getElementById("longText");

  text.style.transform = "rotate(" + alpha + "deg)";

}
