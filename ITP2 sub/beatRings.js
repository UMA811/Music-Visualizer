function BeatRings() {
  this.name = "beatRings";
  this.rings = [];
  this.snowParticles = []; // Array for snow particles
  
  // Threshold values for beat detection
  this.threshold = 0.12;
  this.voiceThreshold = 0.10;
  this.tambourineThreshold = 0.08;
  this.snowThreshold = 0.09; // For snow effect (sustained high frequency)
  
  // Previous frame levels
  this.prevBassLevel = 0;
  this.prevMidLevel = 0;
  this.prevHighLevel = 0;
  this.prevVoiceLevel = 0;
  this.prevTambourineLevel = 0;
  this.prevSnowLevel = 0;
  this.snowSustainCounter = 0; // Sustained sound counter
  
  // Unified color scheme
  this.colors = {
    bass: color(130, 30, 240),      // Purple (low frequency)
    mid: color(30, 50, 200),        // Blue (mid frequency)
    high: color(0, 180, 255),       // Sky blue (high frequency)
    voice: color(255, 80, 190),     // Pink (human voice)
    tambourine: color(255, 220, 50), // Yellow (tambourine)
    snow: color(200, 240, 255)      // Light blue-white (snow)
  };
  
  this.draw = function() {
    push();
    // Move to center
    translate(width / 2, height / 2);
    
    // Semi-transparent background (trail effect)
    background(0, 25);
    
    // Spectrum analysis
    let spectrum = fourier.analyze();
    
    // Base radius for timer
    let baseRadius = 220;
    
    // Draw background circle (with unified color scheme)
    noFill();
    stroke(30, 20, 70); // Dark purple
    strokeWeight(10);
    ellipse(0, 0, baseRadius * 2 + 20, baseRadius * 2 + 20);
    
    // Draw inner circle
    stroke(70, 40, 120); // Light purple
    strokeWeight(5);
    ellipse(0, 0, baseRadius * 2 - 10, baseRadius * 2 - 10);
    
    // Calculate frequency band levels
    let bassLevel = this.getAverageLevel(spectrum, 0, 0.1);
    let midLevel = this.getAverageLevel(spectrum, 0.1, 0.5);
    let highLevel = this.getAverageLevel(spectrum, 0.5, 1.0);
    let voiceLevel = this.getAverageLevel(spectrum, 0.05, 0.2);
    let tambourineLevel = this.getAverageLevel(spectrum, 0.7, 0.95);
    
    // Broadband high frequency analysis for snow effect (sustained cymbals or sustain sound)
    let snowLevel = this.getAverageLevel(spectrum, 0.6, 0.9);
    
    // Voice characteristic analysis
    let voiceDetected = false;
    if (voiceLevel > this.voiceThreshold && voiceLevel > this.prevVoiceLevel * 1.05) {
      let voiceMidRatio = this.getAverageLevel(spectrum, 0.08, 0.15) / 
                          this.getAverageLevel(spectrum, 0.2, 0.4);
      
      if (voiceMidRatio > 1.2) {
        voiceDetected = true;
      }
    }
    
    // Tambourine sound detection
    let tambourineDetected = false;
    if (tambourineLevel > this.tambourineThreshold && 
        tambourineLevel > this.prevTambourineLevel * 1.5) {
      
      let highMidRatio = tambourineLevel / midLevel;
      
      if (highMidRatio > 1.3) {
        tambourineDetected = true;
      }
    }
    
    // Snow effect detection (sustained high tone)
    let snowDetected = false;
    if (snowLevel > this.snowThreshold) {
      // When high tone persists above threshold
      this.snowSustainCounter++;
      
      // Activate snow effect if high tone persists for certain time
      if (this.snowSustainCounter > 10 && 
          abs(snowLevel - this.prevSnowLevel) < 0.03) { // Stable sound
        snowDetected = true;
      }
    } else {
      this.snowSustainCounter = 0;
    }
    
    // Low frequency beat detection
    if (bassLevel > this.threshold && bassLevel > this.prevBassLevel * 1.1) {
      this.createRing("bass", bassLevel, this.colors.bass, 1.8, 8, baseRadius);
    }
    
    // Mid frequency beat detection
    if (midLevel > this.threshold && midLevel > this.prevMidLevel * 1.1) {
      this.createRing("mid", midLevel, this.colors.mid, 1.5, 6, baseRadius);
    }
    
    // High frequency beat detection
    if (highLevel > this.threshold && highLevel > this.prevHighLevel * 1.1) {
      this.createRing("high", highLevel, this.colors.high, 1.2, 4, baseRadius);
    }
    
    // Human voice beat detection
    if (voiceDetected) {
      this.createRing("voice", voiceLevel, this.colors.voice, 1.4, 5, baseRadius);
    }
    
    // Tambourine sound detection
    if (tambourineDetected) {
      this.createRing("tambourine", tambourineLevel, this.colors.tambourine, 2.2, 2, baseRadius);
    }
    
    // Snow effect detection
    if (snowDetected) {
      this.createRing("snow", snowLevel, this.colors.snow, 1.0, 3, baseRadius);
    }
    
    // Update and draw rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      let ring = this.rings[i];
      
      // Expand ring
      ring.radius += ring.growth;
      
      // Gradually reduce transparency
      ring.alpha = map(ring.radius, ring.startRadius, ring.maxRadius, 255, 0);
      
      // Select drawing method based on ring type
      this.drawRing(ring);
      
      // Generate particles for snow
      if (ring.type === "snow" && frameCount % 3 === 0) {
        this.createSnowParticles(ring);
      }
      
      // Remove rings that exceed maximum size
      if (ring.radius > ring.maxRadius) {
        this.rings.splice(i, 1);
      }
    }
    
    // Update and draw snow particles
    this.updateAndDrawSnowParticles();
    
    // Save current frame levels
    this.prevBassLevel = bassLevel;
    this.prevMidLevel = midLevel;
    this.prevHighLevel = highLevel;
    this.prevVoiceLevel = voiceLevel;
    this.prevTambourineLevel = tambourineLevel;
    this.prevSnowLevel = snowLevel;
    
    pop();
  };
  
  // Generate snow particles
  this.createSnowParticles = function(ring) {
    // Place multiple particles on the current circumference of the ring
    let particleCount = floor(random(3, 8)); // Number of particles to generate at once
    
    for (let i = 0; i < particleCount; i++) {
      // Random angle
      let angle = random(TWO_PI);
      
      // Starting position (on the ring's circumference)
      let x = ring.radius * cos(angle);
      let y = ring.radius * sin(angle);
      
      // Particle properties
      this.snowParticles.push({
        x: x,
        y: y,
        size: random(2, 5),
        alpha: 255,
        speedX: random(-0.5, 0.5), // Horizontal movement
        speedY: random(-0.2, 0.2), // Vertical movement
        drift: random(0.3, 0.7),   // Floating speed
        angle: random(TWO_PI),     // Rotation angle
        rotationSpeed: random(-0.02, 0.02), // Rotation speed
        life: 255,
        decay: random(0.5, 1.5)    // Life decay rate
      });
    }
  };
  
  // Update and draw snow particles
  this.updateAndDrawSnowParticles = function() {
    // Limit maximum number of particles (for performance)
    if (this.snowParticles.length > 500) {
      this.snowParticles = this.snowParticles.slice(-500);
    }
    
    noStroke();
    for (let i = this.snowParticles.length - 1; i >= 0; i--) {
      let p = this.snowParticles[i];
      
      // Update particle position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Floating movement
      p.x += sin(frameCount * 0.05 + p.angle) * p.drift;
      p.y += cos(frameCount * 0.05 + p.angle) * p.drift;
      
      // Update rotation angle
      p.angle += p.rotationSpeed;
      
      // Decrease life
      p.life -= p.decay;
      
      // Set transparency
      let alpha = p.life;
      
      // Draw particle
      fill(
        red(this.colors.snow),
        green(this.colors.snow),
        blue(this.colors.snow),
        alpha
      );
      
      // Draw snowflake
      push();
      translate(p.x, p.y);
      rotate(p.angle);
      
      // Hexagonal snowflake
      let size = p.size;
      beginShape();
      for (let j = 0; j < 6; j++) {
        let a = (j / 6) * TWO_PI;
        vertex(cos(a) * size, sin(a) * size);
        
        // Add branches
        let branchA1 = a + PI/6;
        let branchA2 = a - PI/6;
        let branchLength = size * 0.4;
        
        // Branches from center
        let bx1 = cos(a) * size * 0.5;
        let by1 = sin(a) * size * 0.5;
        let bx2 = cos(a) * (size + branchLength * 0.6);
        let by2 = sin(a) * (size + branchLength * 0.6);
        
        // Draw branches
        line(bx1, by1, bx2, by2);
        
        // Small branches at the tips
        line(
          bx2, by2,
          bx2 + cos(branchA1) * branchLength * 0.4,
          by2 + sin(branchA1) * branchLength * 0.4
        );
        
        line(
          bx2, by2,
          bx2 + cos(branchA2) * branchLength * 0.4,
          by2 + sin(branchA2) * branchLength * 0.4
        );
      }
      endShape(CLOSE);
      pop();
      
      // Remove particles that have expired
      if (p.life <= 0) {
        this.snowParticles.splice(i, 1);
      }
    }
  };
  
  // Draw ring (by type)
  this.drawRing = function(ring) {
    noFill();
    strokeWeight(ring.thickness);
    
    switch(ring.type) {
      case "bass":
        // Bass (purple): Solid line expanding with pulse
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        
        // Pulse effect (radius with slight wave)
        let pulseRadius = ring.radius + sin(frameCount * 0.3) * (ring.thickness * 0.8);
        ellipse(0, 0, pulseRadius * 2, pulseRadius * 2);
        break;
        
      case "mid":
        // Mid frequency (blue): Flower-shaped ring
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        
        // Flower petal shape
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.1) {
          // 6 petals
          let petalRadius = ring.radius * (1 + sin(a * 6) * 0.1);
          let x = petalRadius * cos(a);
          let y = petalRadius * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
        break;
        
      case "high":
        // High frequency (sky blue): Dotted ring
        for (let a = 0; a < TWO_PI; a += 0.3) {
          // Each point of dotted line
          let x = ring.radius * cos(a);
          let y = ring.radius * sin(a);
          
          stroke(
            red(ring.color),
            green(ring.color),
            blue(ring.color),
            ring.alpha
          );
          
          // Small line segments instead of dots
          let len = 0.2;
          let x2 = ring.radius * cos(a + len);
          let y2 = ring.radius * sin(a + len);
          line(x, y, x2, y2);
        }
        break;
        
      case "voice":
        // Human voice (pink): Ring with vibrato-like waves
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        
        // Wavy effect
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.1) {
          // Multiple overlapping waves for complex vibrato effect
          let waveRadius = ring.radius + 
                          sin(a * 4 + frameCount * 0.1) * (ring.thickness * 0.8) +
                          sin(a * 7 + frameCount * 0.05) * (ring.thickness * 0.4);
          let x = waveRadius * cos(a);
          let y = waveRadius * sin(a);
          vertex(x, y);
        }
        endShape(CLOSE);
        break;
        
      case "tambourine":
        // Tambourine (yellow): Sparkle/fragment effect
        
        // Main ring (zigzag)
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        
        // Zigzag ring
        beginShape();
        let segments = 24; // Number of segments
        for (let i = 0; i < segments; i++) {
          let angle = (i / segments) * TWO_PI;
          // Zigzag amplitude decreases over time
          let zigAmp = map(ring.radius, ring.startRadius, ring.maxRadius, 
                          ring.thickness * 1.5, 0);
          
          // Alternate inner and outer points
          let r = ring.radius;
          if (i % 2 === 0) {
            r -= zigAmp;
          } else {
            r += zigAmp;
          }
          
          let x = r * cos(angle);
          let y = r * sin(angle);
          vertex(x, y);
        }
        endShape(CLOSE);
        
        // Add small fragments (sparkles)
        noStroke();
        fill(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        
        // Number of particles decreases as the ring size increases
        let particleCount = floor(map(ring.radius, ring.startRadius, ring.maxRadius, 
                                  12, 3));
        
        for (let i = 0; i < particleCount; i++) {
          let angle = (i / particleCount) * TWO_PI + 
                    // Add random angle offset
                    random(-0.3, 0.3);
          
          // Position slightly away from the ring
          let particleDistance = random(0.8, 1.2) * ring.radius;
          
          let x = particleDistance * cos(angle);
          let y = particleDistance * sin(angle);
          
          // Random fragment size
          let particleSize = random(2, 5);
          
          // Star-shaped fragment
          push();
          translate(x, y);
          rotate(frameCount * 0.01 + i);
          
          // Simple star
          beginShape();
          for (let j = 0; j < 5; j++) {
            let starAngle = (j / 5) * TWO_PI;
            let sx = cos(starAngle) * particleSize;
            let sy = sin(starAngle) * particleSize;
            vertex(sx, sy);
            
            // Inner points (star shape)
            let innerAngle = starAngle + PI/5;
            let innerRadius = particleSize * 0.4;
            let isx = cos(innerAngle) * innerRadius;
            let isy = sin(innerAngle) * innerRadius;
            vertex(isx, isy);
          }
          endShape(CLOSE);
          pop();
        }
        break;
        
      case "snow":
        // Snow effect (light blue-white): Soft snowflake ring
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha * 0.7 // More transparent
        );
        
        // Soft snow-like contour
        beginShape();
        let snowSegments = 36;
        for (let i = 0; i < snowSegments; i++) {
          let angle = (i / snowSegments) * TWO_PI;
          
          // Create variations with multiple frequencies
          let noiseValue = 
            sin(angle * 6 + frameCount * 0.02) * 0.3 +
            sin(angle * 9 + frameCount * 0.01) * 0.2 +
            sin(angle * 3 - frameCount * 0.03) * 0.1;
            
          // Subtle jaggedness for snowflake effect
          let snowRadius = ring.radius * (1 + noiseValue * 0.1);
          
          let x = snowRadius * cos(angle);
          let y = snowRadius * sin(angle);
          vertex(x, y);
        }
        endShape(CLOSE);
        
        // For snow, just a solid line; particles are generated and updated separately
        break;
        
      default:
        // Default: Regular circular ring
        stroke(
          red(ring.color),
          green(ring.color),
          blue(ring.color),
          ring.alpha
        );
        ellipse(0, 0, ring.radius * 2, ring.radius * 2);
    }
  };
  
  // Get average level of frequency band
  this.getAverageLevel = function(spectrum, startPct, endPct) {
    let start = Math.floor(spectrum.length * startPct);
    let end = Math.floor(spectrum.length * endPct);
    let sum = 0;
    
    for (let i = start; i < end; i++) {
      sum += spectrum[i];
    }
    
    return sum / ((end - start) * 255); // Normalize to 0-1 range
  };
  
  // Create new ring
  this.createRing = function(type, level, ringColor, speedFactor, thicknessFactor, startRadius) {
    this.rings.push({
      type: type,               // Ring type
      radius: startRadius,      // Starting radius
      startRadius: startRadius, // Record starting radius
      maxRadius: startRadius + 400, // Maximum radius
      growth: 2 + level * 10 * speedFactor, // Growth speed
      color: ringColor,         // Ring color
      alpha: 255,               // Initial transparency
      thickness: thicknessFactor + level * 10, // Ring thickness
      birth: frameCount         // Frame when generated
    });
  };
}