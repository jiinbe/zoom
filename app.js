// JavaScript to handle image processing
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var image = new Image();
var twibbon = new Image();
var scale = 1;
var position = { x: 0, y: 0 };
var dragStart, dragged;
// JavaScript untuk menangani pergerakan gambar
var MOVE_AMOUNT = 10; // Jumlah piksel gambar bergerak per klik

document.getElementById('moveLeft').addEventListener('click', function() {
position.x -= MOVE_AMOUNT; // Minus untuk bergerak ke kiri
draw();
});

document.getElementById('moveRight').addEventListener('click', function() {
position.x += MOVE_AMOUNT; // Plus untuk bergerak ke kanan
draw();
});

document.getElementById('moveUp').addEventListener('click', function() {
position.y -= MOVE_AMOUNT; // Minus untuk bergerak ke atas
draw();
});

document.getElementById('moveDown').addEventListener('click', function() {
position.y += MOVE_AMOUNT; // Plus untuk bergerak ke bawah
draw();
});

twibbon.src = 'twibbon.png'; // Make sure 'twibbon.png' is in the correct directory
twibbon.onload = function() {
draw(); // Draw twibbon once it's loaded
};

$('#imageUpload').change(function (e) {
var file = e.target.files[0];
if (file) {
var reader = new FileReader();
reader.onload = function (event) {
image.src = event.target.result;
image.onload = function() {
reset();
draw();
}
};
reader.readAsDataURL(file);
}
});

function reset() {
scale = 1;
position = { x: 0, y: 0 };
}

function draw() {
var iw = image.width;
var ih = image.height;
var cw = canvas.width;
var ch = canvas.height;

var scaleFactor = Math.min(cw / iw, ch / ih);
var iwScaled = iw * scaleFactor * scale;
var ihScaled = ih * scaleFactor * scale;

ctx.clearRect(0, 0, cw, ch);
ctx.save();
ctx.translate(cw / 2, ch / 2); // Center the image in the canvas
ctx.scale(scaleFactor * scale, scaleFactor * scale); // Scale the image
ctx.translate(-iw / 2 + position.x / (scaleFactor * scale), -ih / 2 + position.y / (scaleFactor * scale));
ctx.drawImage(image, 0, 0); // Draw the uploaded image
ctx.restore();
ctx.drawImage(twibbon, 0, 0, cw, ch); // Draw the twibbon overlay
}

function resizeCanvas() {
canvas.width = $('#canvasContainer').width();
canvas.height = canvas.width; // Maintain aspect ratio
draw();
}

$('#zoomControl').on('input', function() {
scale = parseFloat($(this).val());
draw();
});

canvas.addEventListener('mousedown', function(evt) {
dragStart = { x: evt.offsetX - position.x, y: evt.offsetY - position.y };
dragged = false;
}, false);

canvas.addEventListener('mousemove', function(evt) {
if (dragStart) {
position.x = evt.offsetX - dragStart.x;
position.y = evt.offsetY - dragStart.y;
draw();
dragged = true;
}
}, false);

canvas.addEventListener('mouseup', function(evt) {
dragStart = null;
}, false);

document.getElementById('saveImage').addEventListener('click', function() {
var dataURL = canvas.toDataURL('image/png');
var link = document.createElement('a');
link.download = 'twibbonized.png';
link.href = dataURL;
link.click();
});

$(window).resize(resizeCanvas);
resizeCanvas(); // Resize the canvas to fit the container size initially

function selectFile() {
  document.getElementById("imageUpload").click();
}
