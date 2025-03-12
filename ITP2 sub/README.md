# Music Visualizer + Pomodoro Timer

This application combines an **advanced music visualizer** with a **25-minute Pomodoro timer**, helping users manage their work sessions while enjoying real-time audio visualizations. Built with p5.js and p5.sound, it processes audio frequency data to create stunning visual representations while providing timer-based prompts to encourage periodic breaks.

![Music Visualizer + Pomodoro Timer]
## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation & Setup](#installation--setup)
5. [Controls](#controls)
6. [Visualizations](#visualizations)
7. [File Structure](#file-structure)
8. [Technical Implementation](#technical-implementation)
9. [Extending the Project](#extending-the-project)
10. [Known Issues](#known-issues)

## Overview

This project is a **p5.js** application that combines a **Pomodoro timer** with a **music visualizer**. The application displays a prominent timer in the center of the screen surrounded by various audio-reactive visualizations. When the timer reaches zero, the music stops and a notification appears, encouraging you to take a break.

The visualizers analyze the audio using FFT (Fast Fourier Transform) to extract frequency information and create dynamic, music-responsive graphics. The modular design makes it easy to add new visualizers or customize existing ones.

## Features

- **Multiple Visualizations**: Four distinct visualization styles with unique aesthetics:
  - **Beat Rings**: Expanding rings that respond to different frequency bands and sound types (bass, mid, high, voice, percussion)
  - **Circular Spectrum**: Radial frequency bars surrounding the timer
  - **City Spectrum**: Audio-reactive cityscape with buildings, windows, and antennas
  - **Thunder Wave**: Lightning-like waveform display with historical trails

- **Pomodoro Timer**: 
  - 25-minute countdown displayed prominently in the center
  - Automatic synchronization with music playback
  - Alert notification when time expires

- **User Interface**:
  - Playback controls (play/pause, stop)
  - Visualizer selection buttons
  - On-screen menu (toggle with spacebar)
  - Fullscreen support

- **Keyboard Controls**:
  - **P**: Play/Pause audio and timer
  - **R**: Reset timer
  - **Space**: Toggle on-screen menu
  - **1-4**: Select visualization


## Controls

### Mouse Controls
- **Click anywhere**: Start audio context (on first interaction)
- **Play/Pause Button**: Start or pause both music and timer
- **Stop Button**: Stop music and reset timer
- **Visualizer Buttons**: Switch between different visualizations
- **Click in empty area**: Toggle fullscreen

### Keyboard Shortcuts
- **P**: Play/Pause music and timer
- **R**: Reset timer to 25 minutes
- **Space**: Toggle on-screen menu
- **1-4**: Switch between visualizations
  - 1: Beat Rings
  - 2: Circular Spectrum
  - 3: City Spectrum
  - 4: Thunder Wave

## Visualizations

### Beat Rings
An advanced visualization that detects different audio characteristics and creates expanding rings with unique visual properties:
- **Bass** (purple): Solid expanding rings for low frequencies
- **Mid** (blue): Flower-shaped rings for mid-range frequencies
- **High** (sky blue): Dotted rings for high frequencies
- **Voice** (pink): Wavy rings triggered by human voice detection
- **Tambourine** (yellow): Sparkle effects for percussion instruments
- **Snow** (light blue): Floating snowflake particles for sustained high frequencies

### Circular Spectrum
A radial frequency analyzer that surrounds the timer with color-coded bars. The length and color of each bar corresponds to the amplitude of a specific frequency band.

### City Spectrum
Creates an audio-reactive cityscape where:
- Building heights correspond to frequency amplitude
- Building windows light up based on audio patterns
- Some buildings feature blinking antenna lights
- Background contains subtle city lights for atmosphere

### Thunder Wave
A waveform visualization with trailing effects:
- Main waveform shown with glow effect
- Historical waveforms create a trailing effect
- Color changes based on audio characteristics
- Glowing points highlight peaks in the waveform

## File Structure

```
.
├─ index.html               # Main HTML entry point
├─ lib/                     # External libraries
│   ├─ p5.min.js            # p5.js core library
│   └─ p5.sound.js          # p5.sound library
├─ assets/                  # Audio files
│   └─ your-audio-file.mp3  # Example audio file
├─ sketch.js                # Main sketch with setup, draw, and timer logic
├─ controlsAndInput.js      # User interface and input handling
├─ playbackControls.js      # Playback buttons (play/pause, stop)
├─ visualizerButtons.js     # Visualizer selection buttons
├─ visualisations.js        # Container for visualization management
├─ beatRings.js             # Beat detection and ring visualization
├─ circularSpectrum.js      # Circular frequency visualization
├─ spectrum.js              # City skyline visualization
└─ wavepattern.js           # Thunder wave visualization
```

## Technical Implementation

### Core Components

1. **Audio Analysis**:
   - Uses p5.sound's FFT (Fast Fourier Transform) to analyze audio
   - Identifies frequency bands for bass, mid, treble, and specific sounds
   - Beat detection algorithm for rhythmic visualizations

2. **Timer System**:
   - Uses `millis()` for frame-rate independent timing
   - Synchronized with audio playback
   - Alert notification when timer completes

3. **Visualization Framework**:
   - Modular architecture with interchangeable visualizers
   - Common interface for all visualizers (name, draw function)
   - Shared access to audio analysis data

4. **User Interface**:
   - Custom button implementations with hover effects
   - Responsive layout that adjusts to window size
   - Keyboard and mouse input handling


## Known Issues

- Browser autoplay policies may require a user gesture (click or key press) before audio can start.
- High-resolution FFT analysis may affect performance on slower devices.
- Some browsers may block local file operations when running directly from the filesystem (use a local server instead).
- Visualization performance may vary based on device capabilities.

