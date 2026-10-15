// Tiny procedural music-box BGM built with Web Audio, so the demo ships no audio files.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let nextStepTime = 0;
let step = 0;

const STEP = 60 / 108 / 2; // eighth notes at 108 BPM
const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

// 8 bars of C major (I-vi-IV-V twice), 0 marks a rest.
const MELODY = [
  76, 79, 84, 79, 76, 79, 84, 0, 81, 84, 88, 84, 81, 79, 76, 0,
  77, 81, 84, 81, 77, 81, 84, 0, 79, 83, 86, 83, 81, 79, 74, 0,
  79, 76, 72, 76, 79, 84, 88, 0, 81, 84, 88, 84, 83, 79, 76, 0,
  84, 81, 77, 81, 84, 86, 84, 0, 86, 83, 79, 83, 86, 88, 86, 0,
];
const BASS = [
  48, 0, 55, 0, 48, 0, 55, 0, 45, 0, 52, 0, 45, 0, 52, 0,
  41, 0, 48, 0, 41, 0, 48, 0, 43, 0, 50, 0, 43, 0, 50, 0,
  48, 0, 55, 0, 48, 0, 55, 0, 45, 0, 52, 0, 45, 0, 52, 0,
  41, 0, 48, 0, 41, 0, 48, 0, 43, 0, 50, 0, 43, 0, 50, 0,
];

function playNote(midi: number, time: number, duration: number, level: number, type: OscillatorType) {
  const osc = ctx!.createOscillator();
  const envelope = ctx!.createGain();
  osc.type = type;
  osc.frequency.value = freq(midi);
  envelope.gain.setValueAtTime(0, time);
  envelope.gain.linearRampToValueAtTime(level, time + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(envelope).connect(master!);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

function tick() {
  if (!ctx || ctx.state !== 'running') return;
  while (nextStepTime < ctx.currentTime + 0.12) {
    const melody = MELODY[step % MELODY.length];
    if (melody) playNote(melody, nextStepTime, STEP * 1.7, 0.05, 'triangle');
    const bass = BASS[step % BASS.length];
    if (bass) playNote(bass, nextStepTime, STEP * 0.85, 0.032, 'sine');
    step += 1;
    nextStepTime += STEP;
  }
}

export function startBgm() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  void ctx.resume();
  if (timer !== null) return;
  nextStepTime = ctx.currentTime + 0.1;
  timer = window.setInterval(tick, 50);
}

export function stopBgm() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}
