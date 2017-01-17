function showConfirmButton() {
  var button = document.getElementById("confirmTextButton")
  button.style.visibility = "visible"
}

function processTextInput() {
  var text = document.getElementById("longTextField").value
  var longText = multiplyText(text, 10)

  document.getElementById("longTextField").style.visibility = "collapse"
  document.getElementById("confirmTextButton").style.visibility = "collapse"
  document.getElementById("longText").innerHTML = longText
}

function multiplyText(text, times) {
  var multipliedText = text

  for (var i = 1; i < times; i++) {
    multipliedText += "<br>" + text
  }

  return multipliedText
}

window.ondevicemotion = function(event) {
	ralpha = event.rotationRate.alpha
	rbeta = event.rotationRate.beta
	rgamma = event.rotationRate.gamma

  var text = document.getElementById("longText")
  half_width = text.naturalWidth / 2
  half_height = text.naturalHeight / 2

	var context = text.getContext("2d")
	var canvasWidth = 600
	var canvasHeight = 600

  text.style.transform = ""

	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.translate(canvasWidth/2, canvasWidth/2);
	context.rotate( 0.895 * rgamma * (Math.PI / 180));
	context.translate(-canvasWidth/2, -canvasWidth/2);
}
