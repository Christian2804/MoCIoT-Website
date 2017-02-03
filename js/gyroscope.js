window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
  alpha = event.alpha;

  var text = document.getElementById("longText");

  text.style.transform = "rotate(" + alpha + "deg)";

}
