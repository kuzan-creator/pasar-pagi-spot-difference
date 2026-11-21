// Tiny WebAudio sound effects, synthesised in code: no audio files, no
// network. The context is created on the first user gesture, so the game
// stays silent until the player actually plays.
let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

function tone(freq, dur, type, gain, when) {
  if (muted) return;
  const ac = ensureContext();
  if (!ac) return;
  if (ac.state === 'suspended') ac.resume();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain || 0.12, ac.currentTime + (when || 0));
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (when || 0) + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + (when || 0));
  osc.stop(ac.currentTime + (when || 0) + dur);
}

/** A happy two-note chime when a difference is found. */
export function playFound() {
  tone(660, 0.12, 'sine', 0.14, 0);
  tone(880, 0.18, 'sine', 0.14, 0.09);
}

/** A low buzz when the player clicks a spot with no difference. */
export function playMiss() {
  tone(160, 0.18, 'sawtooth', 0.06, 0);
}

/** A short fanfare when a level is completed. */
export function playWin() {
  tone(523, 0.14, 'triangle', 0.14, 0);
  tone(659, 0.14, 'triangle', 0.14, 0.12);
  tone(784, 0.22, 'triangle', 0.14, 0.24);
}

/** A soft tick when the hint is used. */
export function playHint() {
  tone(990, 0.08, 'sine', 0.08, 0);
}
