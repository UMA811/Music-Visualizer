// circularSpectrum.js - Improved version
function CircularSpectrum() {
  this.name = "circularSpectrum";
  
  // Previous spectrum data (for smooth animation)
  this.prevSpectrum = [];
  
  this.draw = function() {
    push();
    // Move to center
    translate(width / 2, height / 2);
    // Use radians for angle calculation
    angleMode(RADIANS);
    
    // Get frequency spectrum array
    let spectrum = fourier.analyze();
    
    // Limit the number of bars for performance
    let numBars = min(spectrum.length, 150); // Limit display bars to 150
    
    // Prepare previous data for smooth transition
    if (this.prevSpectrum.length === 0) {
      this.prevSpectrum = new Array(numBars).fill(0);
    }
    
    // Base radius around timer
    let baseRadius = 220;
    
    // Draw background circle
    noFill();
    stroke(30, 30, 50);
    strokeWeight(10);
    ellipse(0, 0, baseRadius * 2 + 20, baseRadius * 2 + 20);
    
    // Draw inner circle
    stroke(50, 50, 80);
    strokeWeight(5);
    ellipse(0, 0, baseRadius * 2 - 10, baseRadius * 2 - 10);
    
    // Draw spectrum bars
    for (let i = 0; i < numBars; i++) {
      // Adjust data index (to cover all frequencies with fewer bars)
      let index = floor(map(i, 0, numBars, 0, spectrum.length));
      let amp = spectrum[index];
      
      // Easing for smooth animation
      this.prevSpectrum[i] = lerp(this.prevSpectrum[i], amp, 0.2);
      amp = this.prevSpectrum[i];
      
      // Angle calculation
      let angle = map(i, 0, numBars, 0, TWO_PI);
      
      // Bar starting point coordinates
      let x1 = baseRadius * cos(angle);
      let y1 = baseRadius * sin(angle);
      
      // Determine bar length based on spectrum amplitude
      let barLength = map(amp, 0, 255, 20, 200); // Set minimum value to 20
      
      // Bar end point coordinates
      let x2 = (baseRadius + barLength) * cos(angle);
      let y2 = (baseRadius + barLength) * sin(angle);
      
      // Set color based on frequency (color transition from low to high frequency)
      let hue = map(i, 0, numBars, 0, 360);
      colorMode(HSB, 360, 100, 100, 100);
      
      // Adjust brightness based on amplitude
      let brightness = map(amp, 0, 255, 40, 100);
      
      // Set stroke color and thickness
      stroke(hue, 80, brightness, 90);
      strokeWeight(map(amp, 0, 255, 5, 20)); // Vary line thickness based on amplitude
      
      // Draw bar
      line(x1, y1, x2, y2);
      
      // Add small circle at bar tip (accent)
      if (amp > 50) { // Only for amplitudes above a certain threshold
        noStroke();
        fill(hue, 90, brightness, 80);
        let size = map(amp, 0, 255, 3, 9);
        ellipse(x2, y2, size, size);
      }
    }
    
    // Return to RGB color mode
    colorMode(RGB, 255, 255, 255, 255);
    
    pop();
  };
}