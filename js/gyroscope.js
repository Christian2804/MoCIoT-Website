window.ondevicemotion = function(event) {
	alpha = event.rotationRate.alpha * Math.PI / 180;

  var text = document.getElementById("longText");

  text.style.transform = "rotate(" + alpha + "deg)";

}
