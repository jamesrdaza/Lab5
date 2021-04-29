// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
var ctx = canvas.getContext('2d');

const imgInput = document.getElementById("image-input")

const clearBtn = document.querySelector("[type='reset']");
const readBtn = document.querySelector("[type='button']");
const submitBtn = document.querySelector("[type='submit']");

//var submit = document.querySelector("[type='submit']");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, 400, 400);
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  // Draw the image
  let dim = getDimmensions(400, 400, img.width, img.height);
  ctx.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);
});

// input: image-input
imgInput.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
  var file = imgInput.files[0]; // FIX LATER
  img.src = URL.createObjectURL(file);
  img.alt = file.name;

  canvas.appendChild(img);
}

// form: submit
const form = document.getElementById('generate-meme');
form.addEventListener('submit', generateText);

function generateText(event) {
  var txtTop = document.getElementById('text-top').value;
  var txtBtm = document.getElementById('text-bottom').value;
  console.log(txtTop);
  console.log(txtBtm);
  ctx.fillText(txtTop, 0, 10); // FIX ME
  ctx.fillText(txtBtm, 0, 100); // FIX ME
  event.preventDefault();

  // toggle buttons
  clearBtn.disabled = false;
  readBtn.disabled = false;
  submitBtn.disabled = true;
}

// button: clear
clearBtn.addEventListener('click', event => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
