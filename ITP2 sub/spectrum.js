function mouseMoved() {
  controls.mouseMoved();
}

function Spectrum() {
  this.name = "citySpectrum";
  this.prevSpectrum = [];
  this.buildingWidth = 16; // Building width
  this.windowSize = 3;     // Window size
  this.windowSpacing = 5;  // Window spacing
  
  // Building characteristics (generated only once at initialization to maintain randomness)
  this.buildingProps = [];
  this.initialized = false;
  
  this.draw = function() {
    push();
    
    // Spectrum analysis
    let spectrum = fourier.analyze();
    
    // Calculate number of buildings
    let numBuildings = floor(width / this.buildingWidth);
    let numFreqs = min(spectrum.length, numBuildings);
    
    // Initialize data for smoothing
    if (this.prevSpectrum.length === 0) {
      this.prevSpectrum = new Array(numFreqs).fill(0);
    }
    
    // Initialize building properties (only once)
    if (!this.initialized) {
      for (let i = 0; i < numFreqs; i++) {
        // Set random properties for each building
        this.buildingProps.push({
          widthVariation: random(0.7, 1.3),  // Width variation
          hasAntenna: random() < 0.15,       // Whether it has an antenna
          antennaHeight: random(5, 15),      // Antenna height
          baseHue: random(180, 260),         // Base hue
          windowPattern: floor(random(0, 4)) // Window pattern
        });
      }
      this.initialized = true;
    }
    
    // Background gradient (night sky)
    background(5, 5, 15);
    noStroke();
    
    // Distant lights (city background)
    for (let i = 0; i < 100; i++) {
      let x = random(width);
      let y = random(height * 0.4, height);
      let size = random(1, 3);
      let brightness = random(20, 100);
      fill(200, 200, 255, brightness);
      ellipse(x, y, size, size);
    }
    
    // Center line (horizon)
    stroke(50, 70, 120, 100);
    strokeWeight(1);
    line(0, height * 0.8, width, height * 0.8);
    
    // Draw each building
    noStroke();
    for (let i = 0; i < numFreqs; i++) {
      // Adjust data index
      let index = floor(map(i, 0, numFreqs, 0, spectrum.length));
      let amp = spectrum[index];
      
      // Emphasize low frequencies (make buildings on the left taller)
      let frequencyFactor = map(i, 0, numFreqs, 1.5, 0.8);
      amp = min(255, amp * frequencyFactor);
      
      // Smooth animation
      this.prevSpectrum[i] = lerp(this.prevSpectrum[i], amp, 0.1);
      amp = this.prevSpectrum[i];
      
      // Get building properties
      let props = this.buildingProps[i];
      
      // Calculate building height
      let buildingHeight = map(amp, 0, 255, 5, height * 0.6);
      
      // Calculate building width (slight variation)
      let actualWidth = this.buildingWidth * props.widthVariation;
      
      // Building X position
      let x = i * this.buildingWidth;
      
      // Building base Y position (horizon)
      let baseY = height * 0.8;
      
      // HSB color mode
      colorMode(HSB, 360, 100, 100);
      
      // Building color (distant buildings are darker and bluer to create depth)
      let distanceFactor = map(buildingHeight, 5, height * 0.6, 0.5, 1);
      let hue = lerp(230, props.baseHue, distanceFactor);
      let saturation = lerp(20, 70, distanceFactor);
      let brightness = lerp(30, 60, distanceFactor);
      
      // Draw building body
      fill(hue, saturation, brightness);
      rect(x, baseY - buildingHeight, actualWidth, buildingHeight);
      
      // Draw building windows
      this.drawBuildingWindows(x, baseY - buildingHeight, actualWidth, buildingHeight, props);
      
      // Draw antenna if present
      if (props.hasAntenna && buildingHeight > height * 0.2) {
        this.drawAntenna(x, baseY - buildingHeight, actualWidth, props.antennaHeight);
      }
    }
    
    // Return to RGB mode
    colorMode(RGB, 255, 255, 255);
    
    pop();
  };
  
  // Function to draw building windows
  this.drawBuildingWindows = function(x, y, width, height, props) {
    // Window colors
    let windowOn = color(255, 255, 150, random(150, 255));
    let windowOff = color(20, 20, 50, 150);
    
    // Calculate number of columns and rows of windows
    let cols = floor(width / this.windowSize);
    let rows = floor(height / this.windowSize);
    
    // Draw windows based on pattern
    for (let row = 1; row < rows - 1; row++) {
      for (let col = 0; col < cols; col++) {
        // Adjust window lighting probability based on pattern
        let lightProbability;
        
        switch(props.windowPattern) {
          case 0: // Random
            lightProbability = 0.3;
            break;
          case 1: // Checkerboard
            lightProbability = (row + col) % 2 === 0 ? 0.7 : 0.1;
            break;
          case 2: // Brighter at the top
            lightProbability = map(row, 0, rows, 0.7, 0.1);
            break;
          case 3: // Horizontal rows
            lightProbability = row % 3 === 0 ? 0.8 : 0.1;
            break;
        }
        
        // Randomly light windows
        if (random() < lightProbability) {
          fill(windowOn);
        } else {
          fill(windowOff);
        }
        
        // Calculate window position and draw
        let windowX = x + col * this.windowSize + 1;
        let windowY = y + row * this.windowSpacing;
        
        // Draw window (small rectangle)
        rect(windowX, windowY, this.windowSize - 1, this.windowSize - 1);
      }
    }
  };
  
  // Function to draw antenna on top of building
  this.drawAntenna = function(x, y, width, antennaHeight) {
    // Antenna position
    let antennaX = x + width / 2;
    
    // Antenna body
    stroke(80, 80, 100);
    strokeWeight(1.5);
    line(antennaX, y, antennaX, y - antennaHeight);
    
    // Warning light (blinking)
    if (frameCount % 30 < 15) {
      fill(255, 0, 0, 200);
    } else {
      fill(150, 0, 0, 150);
    }
    noStroke();
    ellipse(antennaX, y - antennaHeight, 3, 3);
  };
}

