// visualizerButtons.js
// Creates buttons to switch between different visualizers

function VisualizerButtons() {
  // Button properties
  this.margin = 20;
  this.topOffset = 20;
  this.buttonHeight = 35;
  this.spacing = 15;
  this.cornerRadius = 8;
  this.buttons = [];
  
  // Initialize the buttons
  this.init = function() {
    this.buttons = [];
    
    let startX = 140; // Starting X position for the first button
    
    // Create a button for each visualizer
    for (let i = 0; i < vis.visuals.length; i++) {
      // Calculate button width based on text length
      let buttonText = vis.visuals[i].name;
      let buttonWidth = textWidth(buttonText) + 30; // Add padding
      
      this.buttons.push({
        x: startX,
        y: this.topOffset,
        width: buttonWidth,
        height: this.buttonHeight,
        label: buttonText,
        visualName: vis.visuals[i].name,
        isHovered: false
      });
      
      // Move the x position for the next button
      startX += buttonWidth + this.spacing;
    }
  };
  
  // Draw all buttons
  this.draw = function() {
    push();
    
    // Set text properties for measuring (must be done before init if not yet called)
    textSize(16);
    textStyle(NORMAL);
    
    // Initialize buttons if not already done
    if (this.buttons.length === 0) {
      this.init();
    }
    
    // Draw each button
    for (let i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];
      let isSelected = (vis.selectedVisual.name === button.visualName);
      
      // Button background
      if (isSelected) {
        // Selected button style
        fill(120, 120, 200, 220);
        stroke(160, 160, 240);
      } else if (button.isHovered) {
        // Hover style
        fill(80, 80, 140, 200);
        stroke(120, 120, 180);
      } else {
        // Normal style
        fill(50, 50, 100, 180);
        stroke(100, 100, 160);
      }
      
      strokeWeight(2);
      rect(button.x, button.y, button.width, button.height, this.cornerRadius);
      
      // Button label
      if (isSelected) {
        fill(255);
        textStyle(BOLD);
      } else {
        fill(220);
        textStyle(NORMAL);
      }
      
      textSize(16);
      textAlign(CENTER, CENTER);
      noStroke();
      text(button.label, button.x + button.width/2, button.y + button.height/2 + 1);
    }
    
    pop();
  };
  
  // Check if mouse position is over a button
  this.mouseMoved = function() {
    for (let i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];
      button.isHovered = mouseX >= button.x && 
                         mouseX <= button.x + button.width && 
                         mouseY >= button.y && 
                         mouseY <= button.y + button.height;
    }
  };
  
  // Handle mouse press events
  this.mousePressed = function() {
    for (let i = 0; i < this.buttons.length; i++) {
      let button = this.buttons[i];
      
      if (mouseX >= button.x && 
          mouseX <= button.x + button.width && 
          mouseY >= button.y && 
          mouseY <= button.y + button.height) {
        
        // Change the selected visualizer
        vis.selectVisual(button.visualName);
        return true;
      }
    }
    
    return false;
  };
  
  // Recreate buttons when window is resized
  this.windowResized = function() {
    this.init();
  };
}