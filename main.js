// "Pasar Pagi — Cari Bedanya!": game state, timer, scoring and bootstrap.
// The hunt: two near-identical pictures side by side. Click a difference
// (or move the crosshair with the arrow keys and press Enter). A found
// difference gets a green ring + tick on BOTH panels, a wrong click flashes
// a red X and costs 5 seconds. Find them all before the timer runs out to
// clear the level; three levels get harder (7, then 8, then 9 differences,
// less time each). Hints are limited to 3 per level.
import { LEVELS, PANEL_W, PANEL_H } from './scenes.js';
import { drawPanel, drawCursor, drawHint } from './render.js';
import { bindInput, hitTest } from './input.js';
import { playFound, playMiss, playWin, playHint, setMuted, isMuted } from './audio.js';
import { parseShot, stageShot } from './shots.js';

const state = {
  levelIndex: 0,
  found: new Set(),
  timeLeft: 120,
  hintsLeft: 3,
  score: 0,
  combo: 0,
  complete: false,
  over: false,
  frozen: false,
  banner: '',
  flash: null,
  flashUntil: 0,
  hint: null,
  hintUntil: 0,
  cursor: { x: PANEL_W / 2, y: PANEL_H / 2 },
  cursorPanel: 'A',
};

const $ = (id) => document.getElementById(id);
const canvasA = $('panel-a');
const canvasB = $('panel-b');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');

function level() {
  return LEVELS[state.levelIndex];
}

function remaining() {
  return level().differences.length - state.found.size;
}

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function updateHud() {
  const lv = level();
  $('level-name').textContent = `Level ${lv.id} — ${lv.name}`;
  $('level-sub').textContent = lv.subtitle;
  $('counter').textContent = `Sisa: ${remaining()}`;
  $('score').textContent = `Skor: ${state.score}`;
  $('timer').textContent = fmtTime(state.timeLeft);
  $('timer').classList.toggle('low', state.timeLeft <= 20 && !state.complete);
  $('hints').textContent = `Petunjuk: ${state.hintsLeft} (H)`;
  $('progress').textContent = lv.differences.map((_, i) => (state.found.has(i) ? '●' : '○')).join(' ');
  document.querySelectorAll('.level-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === state.levelIndex);
  });
  $('mute-btn').textContent = isMuted() ? 'Suara: Mati (M)' : 'Suara: Hidup (M)';
  if (state.banner) $('message').textContent = state.banner;
  else if (state.over) $('message').textContent = 'Waktu habis! Tekan R untuk mencoba lagi.';
  else if (state.complete) $('message').textContent = 'Level selesai! Tekan N untuk level berikutnya.';
  else if (remaining() === 0) $('message').textContent = 'Semua ketemu!';
  else $('message').textContent = 'Klik perbedaan di gambar kiri atau kanan — panah + Enter juga bisa.';
}

function render(now) {
  const lv = level();
  const flash = state.flash && now < state.flashUntil ? state.flash : null;
  drawPanel(ctxA, lv, 'A', state.found, flash);
  drawPanel(ctxB, lv, 'B', state.found, flash);
  if (state.hint && now < state.hintUntil) {
    const diff = lv.differences[state.hint];
    drawHint(ctxA, diff, now / 300);
    drawHint(ctxB, diff, now / 300);
  }
  const activeCtx = state.cursorPanel === 'A' ? ctxA : ctxB;
  drawCursor(activeCtx, state.cursor, true);
  drawCursor(state.cursorPanel === 'A' ? ctxB : ctxA, state.cursor, false);
}

function setLevel(index) {
  state.levelIndex = index;
  const lv = level();
  state.found = new Set();
  state.timeLeft = lv.seconds;
  state.hintsLeft = 3;
  state.combo = 0;
  state.complete = false;
  state.over = false;
  state.banner = '';
  state.flash = null;
  state.hint = null;
  updateHud();
}

function onPick(x, y) {
  if (state.frozen || state.complete || state.over) return;
  const lv = level();
  const hit = hitTest(lv, state.found, x, y);
  if (hit >= 0) {
    state.found.add(hit);
    state.combo += 1;
    const gained = 100 + Math.min(50, Math.floor(state.timeLeft / 10)) + (state.combo - 1) * 10;
    state.score += gained;
    state.banner = `Ketemu! ${lv.differences[hit].label} (+${gained})`;
    playFound();
    if (remaining() === 0) {
      state.complete = true;
      state.score += Math.floor(state.timeLeft) * 2;
      state.banner = `Level Selesai! Semua ${lv.differences.length} perbedaan ketemu. Bonus waktu +${Math.floor(state.timeLeft) * 2}.`;
      playWin();
    }
  } else {
    state.combo = 0;
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    state.flash = { x, y };
    state.flashUntil = performance.now() + 600;
    state.banner = 'Bukan di situ — minus 5 detik. Perhatikan baik-baik!';
    playMiss();
    if (state.timeLeft <= 0) state.over = true;
  }
  updateHud();
}

function onHint() {
  if (state.frozen || state.complete || state.over) return;
  if (state.hintsLeft <= 0) {
    state.banner = 'Petunjuk habis untuk level ini.';
    updateHud();
    return;
  }
  const lv = level();
  const unfound = lv.differences.map((_, i) => i).filter((i) => !state.found.has(i));
  if (unfound.length === 0) return;
  state.hintsLeft -= 1;
  state.hint = unfound[Math.floor(unfound.length / 2)];
  state.hintUntil = performance.now() + 2200;
  state.banner = `Petunjuk: perhatikan area "${lv.differences[state.hint].label}".`;
  playHint();
  updateHud();
}

function timerTick() {
  if (state.frozen || state.complete || state.over) return;
  state.timeLeft -= 0.25;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.over = true;
  }
  updateHud();
}

function frame(now) {
  render(now);
  requestAnimationFrame(frame);
}

function boot() {
  const { shot } = parseShot();
  if (shot) {
    const staged = stageShot(state, shot);
    state.frozen = staged.frozen;
    state.banner = staged.banner;
  } else {
    setLevel(0);
  }
  updateHud();
  render(performance.now());
  bindInput({
    onPick,
    onHint,
    onRestart: () => {
      if (state.frozen) return;
      setLevel(state.levelIndex);
    },
    onMute: () => {
      setMuted(!isMuted());
      updateHud();
    },
    onLevel: (i) => {
      if (state.frozen) return;
      setLevel(i);
    },
    onNext: () => {
      if (state.frozen || !state.complete) return;
      if (state.levelIndex < LEVELS.length - 1) setLevel(state.levelIndex + 1);
      else {
        state.banner = 'Kamu menamatkan Pasar Pagi! Skor akhir: ' + state.score + '. Tekan R untuk main lagi.';
        updateHud();
      }
    },
    getCursor: () => state.cursor,
    setCursor: (c) => {
      state.cursor = c;
    },
  });
  // Clicking a panel makes it the keyboard-active one.
  canvasA.addEventListener('click', () => {
    state.cursorPanel = 'A';
  });
  canvasB.addEventListener('click', () => {
    state.cursorPanel = 'B';
  });
  $('mute-btn').addEventListener('click', () => {
    setMuted(!isMuted());
    updateHud();
  });
  $('hint-btn').addEventListener('click', onHint);
  $('restart-btn').addEventListener('click', () => {
    if (!state.frozen) setLevel(state.levelIndex);
  });
  document.querySelectorAll('.level-tab').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (!state.frozen) setLevel(i);
    });
  });
  setInterval(timerTick, 250);
  requestAnimationFrame(frame);
}

boot();
