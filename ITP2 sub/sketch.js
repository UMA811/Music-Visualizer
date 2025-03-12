

// sketch.js
// Main p5.js sketch file

// Global references
var controls = null;
var vis = null;
var sound = null;
var fourier;

//START_OF_PERSONAL_CODE
// Timer-related variables
var totalSeconds = 25 * 60;  // 25 minutes
var isTimerRunning = false;
var previousMillis = 0;

function preload() {
  // Load the audio file (ensure the path is correct)
  //sound = loadSound('assets/stomper_reggae_bit.mp3');
    sound = loadSound('assets/Stay with me (remix) ( soft bass boost).mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // Create a controls manager
  controls = new ControlsAndInput();

  // Create the FFT object for frequency analysis
  fourier = new p5.FFT();

  // Create a Visualisations container and add multiple visualizers
  vis = new Visualisations();
  vis.add(new BeatRings());    
  vis.add(new CircularSpectrum());  // Custom circular spectrum
  vis.add(new Spectrum());          // Default linear spectrum
  vis.add(new WavePattern());       // Example wave visualizer
}

function draw() {
  background(30);

  // Timer countdown using millis() to avoid frame-rate issues
  let currentMillis = millis();
  if (isTimerRunning && totalSeconds > 0 && currentMillis - previousMillis >= 1000) {
    totalSeconds--;
    previousMillis = currentMillis;
  }
  // If time runs out, stop the music and alert the user
  if (totalSeconds === 0 && isTimerRunning) {
    isTimerRunning = false;
    sound.stop();
    alert("The timer has ended. Time to take a break!");
  }

  // Draw the selected visualization (circular or others)
  vis.selectedVisual.draw();

  // Display the timer at the center of the screen
  displayTimer();

  // Finally, draw the controls on top
  controls.draw();
}

function displayTimer() {
  push();
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(255);

  let minutes = floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let timeStr = nf(minutes, 2) + ":" + nf(seconds, 2);

  // Draw the timer at the center
  text(timeStr, width / 2, height / 2);
  pop();
}

// Reset the timer back to 25 minutes
function resetTimer() {
  totalSeconds = 25 * 60;
  isTimerRunning = false;
  sound.stop();
  previousMillis = millis();
}

// Pass key events to ControlsAndInput
function keyPressed() {
  controls.keyPressed(keyCode);
}

// Pass mouse events to ControlsAndInput
function mousePressed() {
  controls.mousePressed();
}

// Adjust canvas size if the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update UI controls for new window size
  if (controls) {
    controls.windowResized();
  }
}

// Add this to the end of the setup() function in sketch.js

// Set up an event handler for when the song ends
sound.onended(function() {
  // Automatically restart playback when the song ends
  sound.play();
  
  // Keep the play button in the playing state
  if (controls && controls.playbackControls) {
    controls.playbackControls.playButton.isPlaying = true;
  }
});
//END_OF_PERSONAL_CODE
