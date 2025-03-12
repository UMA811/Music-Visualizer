// controlsAndInput.js
// Manages on-screen menus, keyboard input, and mouse events.
function ControlsAndInput() {
  this.menuDisplayed = false;
  
  // Replace PlaybackButton with the new PlaybackControls
  this.playbackControls = new PlaybackControls();
  
  // Add visualizer selection buttons
  this.visualizerButtons = new VisualizerButtons();
  
  // Handle mouse click events
  this.mousePressed = function() {
    // First check if either play or stop button was clicked
    if (this.playbackControls.mousePressed()) {
      // Button was clicked, no further actions needed
      return;
    }
    
    // Then check if any visualizer button was clicked
    if (this.visualizerButtons.mousePressed()) {
      // Visualizer button was clicked, no further actions needed
      return;
    }
    
    // If the click is not on any controls,
    // switch fullscreen mode on or off.
    let fs = fullscreen();
    fullscreen(!fs);
    
    // Ensure user gesture allows AudioContext to start
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  };
  
  // Handle mouse movement for hover effects
  this.mouseMoved = function() {
    this.playbackControls.mouseMoved();
    this.visualizerButtons.mouseMoved();
  };
  
  // Handle keyboard presses
  // @param keycode: ASCII code of the pressed key
  this.keyPressed = function(keycode) {
    console.log(keycode);
    // Space (ASCII 32) toggles the on-screen menu
    if (keycode === 32) {
      this.menuDisplayed = !this.menuDisplayed;
    }
    
    // 'P' key (ASCII 80) toggles audio playback and timer
    if (keycode === 80) {
      if (sound.isPlaying()) {
        sound.pause();
        isTimerRunning = false;
        this.playbackControls.playButton.isPlaying = false;
      } else {
        sound.play();
        isTimerRunning = true;
        this.playbackControls.playButton.isPlaying = true;
      }
    }
    
    // 'R' key (ASCII 82) resets the timer
    if (keycode === 82) {
      resetTimer();
      this.playbackControls.playButton.isPlaying = false;
    }
    
    // Number keys (ASCII 49 to 57) select visualizations
    if (keycode > 48 && keycode < 58) {
      let visNumber = keycode - 49;
      // Check if visNumber is within the array range
      if (visNumber >= 0 && visNumber < vis.visuals.length) {
        vis.selectVisual(vis.visuals[visNumber].name);
      } else {
        console.log("No visual associated with this key");
      }
    }
  };
  
  // Draw the playback controls and menu (if displayed)
  this.draw = function() {
    push();
    // Draw the new playback controls
    this.playbackControls.draw();
    
    // Draw visualizer selection buttons
    this.visualizerButtons.draw();
    
    // If the menu is toggled on, draw it
    if (this.menuDisplayed) {
      fill("white");
      stroke("black");
      strokeWeight(2);
      textSize(34);
      text("Select a visualisation:", 100, 30);
      this.menu();
    }
    pop();
  };
  
  // Menu to list all available visualizations
  this.menu = function() {
    fill("white");
    stroke("black");
    strokeWeight(2);
    textSize(34);
    
    for (let i = 0; i < vis.visuals.length; i++) {
      let yLoc = 70 + i * 40;
      text((i + 1) + ": " + vis.visuals[i].name, 100, yLoc);
    }
  };
  
  // Handle window resize events
  this.windowResized = function() {
    this.visualizerButtons.windowResized();
  };
}



