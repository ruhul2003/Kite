// Web Audio API Ambient Sound Generator for Kite
// Generates soothing procedural sounds (Rain, Lofi Chords, Cosmic Drone, Coffeehouse Ambiance)

let audioCtx = null;
let activeSourceNodes = [];
let gainNode = null;
let currentTrackId = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSound() {
  try {
    activeSourceNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore
      }
    });
    activeSourceNodes = [];
    currentTrackId = null;
  } catch (err) {
    console.warn("Error stopping ambient sound:", err);
  }
}

export function playAmbientSound(trackId, volume = 0.4) {
  stopAmbientSound();

  const ctx = getAudioContext();
  if (!ctx) return;

  gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.connect(ctx.destination);
  currentTrackId = trackId;

  if (trackId === "rain") {
    // Pink / Brown Noise synthesized rainfall
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft rainfall
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    whiteNoise.start();
    activeSourceNodes.push(whiteNoise);

  } else if (trackId === "cosmic") {
    // Deep harmonic binaural drone (warm sine waves)
    const baseFreqs = [110, 164.81, 220, 277.18]; // A2, E3, A3, C#4 (Warm A Major chord)
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq + (idx * 0.5), ctx.currentTime); // Slight detune for celestial shimmer

      oscGain.gain.setValueAtTime(0.12 / baseFreqs.length, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      activeSourceNodes.push(osc);
    });

  } else if (trackId === "coffee") {
    // Warm gentle coffeehouse murmur filter
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    noise.start();
    activeSourceNodes.push(noise);

    // Warm subtle hum
    const hum = ctx.createOscillator();
    hum.type = "triangle";
    hum.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.04, ctx.currentTime);
    hum.connect(humGain);
    humGain.connect(gainNode);
    hum.start();
    activeSourceNodes.push(hum);

  } else {
    // Lo-Fi Chord progression simulation (Gentle 7th chord swells)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 207.65, 246.94, 311.13], // Em7
    ];
    let chordIdx = 0;

    const playChordOscs = () => {
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((f) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.01, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
        oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.8);

        osc.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start();
        osc.stop(ctx.currentTime + 4.0);
        activeSourceNodes.push(osc);
      });
    };

    playChordOscs();
    const interval = setInterval(() => {
      if (currentTrackId === "lofi" && ctx.state === "running") {
        playChordOscs();
      } else {
        clearInterval(interval);
      }
    }, 4000);
  }
}

export function setAmbientVolume(vol) {
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}
