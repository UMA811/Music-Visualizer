//wavepattern.js

function WavePattern() {
  this.name = "thunderWave";
  this.history = [];
  this.maxHistory = 10; // Number of past waveforms to store
  
  this.draw = function() {
    background(0, 30); // Semi-transparent background for fade effect
    
    // Get waveform data
    let wave = fourier.waveform();
    
    // Add current waveform to history
    this.history.unshift(wave.slice(0)); // Save a copy of the array
    
    // Remove oldest data if history exceeds maximum size
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
    
    // Translate to draw from center
    push();
    translate(0, height / 2);
    
    // Draw historical waveforms (older ones more transparent)
    for (let h = 0; h < this.history.length; h++) {
      let historicWave = this.history[h];
      let alpha = map(h, 0, this.history.length, 200, 20);
      
      // Determine color by analyzing spectrum
      let spectrum = fourier.analyze();
      let lowEnergy = this.getEnergyInRange(spectrum, 0, 0.1);
      let midEnergy = this.getEnergyInRange(spectrum, 0.1, 0.5);
      let highEnergy = this.getEnergyInRange(spectrum, 0.5, 1.0);
      
      // Set color based on energy levels
      let r = map(lowEnergy, 0, 255, 50, 255);
      let g = map(midEnergy, 0, 255, 50, 255);
      let b = map(highEnergy, 0, 255, 100, 255);
      
      // Prepare for drawing
      noFill();
      stroke(r, g, b, alpha);
      strokeWeight(map(h, 0, this.history.length, 3, 1));
      
      // Lower waveform (inverted)
      beginShape();
      for (let i = 0; i < historicWave.length; i += 2) { // Skip points for performance
        let x = map(i, 0, historicWave.length, 0, width);
        let y = map(historicWave[i], -1, 1, -height/4, height/4);
        
        // Effect of waveform moving down over time
        y += h * 5;
        
        vertex(x, y);
      }
      endShape();
      
      // Upper waveform (inverted)
      beginShape();
      for (let i = 0; i < historicWave.length; i += 2) {
        let x = map(i, 0, historicWave.length, 0, width);
        let y = map(historicWave[i], -1, 1, -height/4, height/4);
        
        // Effect of waveform moving up over time
        y -= h * 5;
        
        vertex(x, -y);
      }
      endShape();
    }
    
    // Current waveform in the center (main waveform)
    let currentWave = this.history[0];
    
    // Center line
    stroke(200, 200, 255, 50);
    strokeWeight(1);
    line(0, 0, width, 0);
    
    // Add glow effect to main waveform
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(150, 150, 255);
    
    // Draw main waveform
    stroke(200, 200, 255);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < currentWave.length; i += 2) {
      let x = map(i, 0, currentWave.length, 0, width);
      let y = map(currentWave[i], -1, 1, -height/3, height/3);
      vertex(x, y);
    }
    endShape();
    
    // Add small glowing points at waveform peaks
    noStroke();
    fill(255);
    let dotCount = 10;
    for (let i = 0; i < dotCount; i++) {
      let index = floor(map(i, 0, dotCount, 0, currentWave.length));
      let x = map(index, 0, currentWave.length, 0, width);
      let y = map(currentWave[index], -1, 1, -height/3, height/3);
      
      // Vary dot size based on amplitude
      let dotSize = map(abs(currentWave[index]), 0, 1, 2, 8);
      ellipse(x, y, dotSize, dotSize);
    }
    
    pop();
  };
  
  this.getEnergyInRange = function(spectrum, startPct, endPct) {
    let start = Math.floor(spectrum.length * startPct);
    let end = Math.floor(spectrum.length * endPct);
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += spectrum[i];
    }
    return sum / (end - start);
  };
}


 