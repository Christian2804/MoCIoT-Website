if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", deviceOrientationListener, true);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

var oldAlpha = 400;

function deviceOrientationListener(event) {
  var alpha = event.alpha;

  if (oldAlpha == 400) {
    oldAlpha = alpha;
  } else {
    oldAlpha = alpha - oldAlpha;
  }

  var image = document.getElementById("compassImage");
  image.style.transform = "rotate(" + oldAlpha + "deg)"
}

function loadCompass() {
  var compassCanvas = document.getElementById("aligningCompass");
  var compassContext = compassCanvas.getContext("2d");
  var img = document.getElementById("compassImage");

  compassContext.drawImage(img, 0, 0);
}
