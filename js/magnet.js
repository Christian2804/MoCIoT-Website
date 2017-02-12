if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", deviceOrientationListener, true);
} else {
  alert("Es tut mir Leid, aber Ihr Gerät unterstützt diesen Sensor nicht.");
}

var oldAlpha = 0;

function deviceOrientationListener(event) {
  var alpha = event.alpha;

  var image = document.getElementById("compassImage");
  halfWidth = image.naturalWidth / 2;
  halfHeight = image.naturalHeight / 2;

  var imageCanvas = document.getElementById("aligningCompass");
  var imageContext = imageCanvas.getContext("2d");

  canvasWidth = imageCanvas.width;
  canvasHeight = imageCanvas.height;

  imageContext.clearRect(0, 0, canvasWidth, canvasHeight);
  imageContext.translate(canvasWidth / 2, canvasHeight / 2);
  imageContext.rotate(oldAlpha);
  imageContext.rotate(alpha);
  imageContext.translate(-canvasWidth / 2, -canvasHeight / 2);
  imageContext.drawImage(image, 0, 0);

  oldAlpha = -alpha;
}

function loadCompass() {
  var compassCanvas = document.getElementById("aligningCompass");
  var compassContext = compassCanvas.getContext("2d");
  var img = document.getElementById("compassImage");

  compassContext.drawImage(img, 0, 0);
}
