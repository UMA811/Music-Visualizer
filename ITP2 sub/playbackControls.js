// playbackControls.js
// Handles Play and Stop buttons for the music visualizer

function PlaybackControls() {
  // Button positions and sizes
  this.buttonSize = 45;   
  this.spacing = 20;      
  this.margin = 20;
  
  // Play button
  this.playButton = {
    x: this.margin,
    y: this.margin,
    width: this.buttonSize,
    height: this.buttonSize,
    isPlaying: false,
    isHovered: false
  };
  
  // Stop button
  this.stopButton = {
    x: this.margin + this.buttonSize + this.spacing,
    y: this.margin,
    width: this.buttonSize,
    height: this.buttonSize,
    isHovered: false
  };
  
  // Draw both buttons
  this.draw = function() {
    push();
    
    // Draw button backgrounds
    this.drawButtonBackground(this.playButton);
    this.drawButtonBackground(this.stopButton);
    
    // Draw Play button icon
    if (this.playButton.isPlaying) {
      // Pause icon (two rectangles)
      fill(255);
      noStroke();
      rect(this.playButton.x + 12, this.playButton.y + 12, 6, 21);
      rect(this.playButton.x + 27, this.playButton.y + 12, 6, 21);
    } else {
      // Play icon (triangle)
      fill(255);
      noStroke();
      triangle(
        this.playButton.x + 15, this.playButton.y + 12,
        this.playButton.x + 33, this.playButton.y + 22.5,
        this.playButton.x + 15, this.playButton.y + 33
      );
    }
    
    // Draw Stop button icon (square)
    fill(255);
    noStroke();
    rect(this.stopButton.x + 12, this.stopButton.y + 12, 21, 21);
    
    pop();
  };
  
  // Draw background for buttons
  this.drawButtonBackground = function(button) {
    if (button.isHovered) {
      // Highlighted state
      fill(90, 90, 140, 220);
    } else {
      // Normal state
      fill(50, 50, 100, 180);
    }
    
    // Button shape with more pronounced rounded corners
    stroke(120, 120, 180);
    strokeWeight(2);  
    rect(button.x, button.y, button.width, button.height, 8);
  };
  
  // Check if mouse position is over a button
  this.isMouseOver = function(button) {
    return mouseX >= button.x && 
           mouseX <= button.x + button.width && 
           mouseY >= button.y && 
           mouseY <= button.y + button.height;
  };
  
  // Handle mouseMoved event for hover effects
  this.mouseMoved = function() {
    this.playButton.isHovered = this.isMouseOver(this.playButton);
    this.stopButton.isHovered = this.isMouseOver(this.stopButton);
  };
  
  // Handle mousePressed event
  this.mousePressed = function() {
    // Play/Pause button clicked
    if (this.isMouseOver(this.playButton)) {
      this.playButton.isPlaying = !this.playButton.isPlaying;
      
      if (this.playButton.isPlaying) {
        // Play music and start timer
        sound.play();
        isTimerRunning = true;
      } else {
        // Pause music and timer
        sound.pause();
        isTimerRunning = false;
      }
      
      return true;
    }
    
    // Stop button clicked
    if (this.isMouseOver(this.stopButton)) {
      // Stop music, reset timer, and update play button state
      sound.stop();
      resetTimer();
      this.playButton.isPlaying = false;
      return true;
    }
    
    return false;
  };
}

