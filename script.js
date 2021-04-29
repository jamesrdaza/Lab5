// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
var ctx = canvas.getContext('2d');

const imgInput = document.getElementById("image-input")

const clearBtn = document.querySelector("[type='reset']");
const readBtn = document.querySelector("[type='button']");
const submitBtn = document.querySelector("[type='submit']");
const volumeSlider = document.querySelector("[type='range']");

const voiceSelector = document.querySelector('select');

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
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = "center";
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillText(txtTop, canvas.width/2, 40); // FIX ME
  ctx.fillText(txtBtm, canvas.width/2, 350); // FIX ME
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 2;
  ctx.strokeText(txtTop, canvas.width/2, 40);
  ctx.strokeText(txtBtm, canvas.width/2, 350);
  event.preventDefault();

  // toggle buttons
  clearBtn.disabled = false;
  readBtn.disabled = false;
  submitBtn.disabled = true;
}

// button: clear
clearBtn.addEventListener('click', event => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // toggle buttons
  clearBtn.disabled = true;
  readBtn.disabled = true;
  submitBtn.disabled = false;
});

// button: read text
var utterance = new SpeechSynthesisUtterance();
readBtn.addEventListener('click', event => {
  var txtTop = document.getElementById('text-top').value;
  var txtBtm = document.getElementById('text-bottom').value;
  //var utterance = new SpeechSynthesisUtterance(txtTop + " " + txtBtm);
  utterance = new SpeechSynthesisUtterance(txtTop + " " + txtBtm);
  // change volume based on slider -- FIX ME CHECK IF PLACEMENT IS OK
  utterance.volume = volumeSlider.value * 0.01;
  // get voice
  var selectedOption = voiceSelector.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterance.voice = voices[i];
    }
  }
  // speak
  speechSynthesis.speak(utterance);
});

var voices = [];
var synth = window.speechSynthesis;

// get all voices
function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelector.appendChild(option);
  }
}

voiceSelector.disabled = false;
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// div: volume-group
volumeSlider.addEventListener('input', updateVolume);

function updateVolume() {
  const volumeIcon = document.getElementById("volume-group").querySelector('img');
  var level = volumeSlider.value;
  if (level >= 67 && level <= 100 ) {
    volumeIcon.src = "icons/volume-level-3.svg";
  }
  else if (level >= 34 && level <= 66) {
    volumeIcon.src = "icons/volume-level-2.svg";
  }
  else if (level >= 1 && level <= 33) {
    volumeIcon.src = "icons/volume-level-1.svg";
  }
  else {
    volumeIcon.src = "icons/volume-level-0.svg";
  }
}

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
