// Screenshot staging behind ?shot=...&seed=... (see shots.json).
// Each shot plays the real game forward to a fixed, deterministic state,
// so a screenshot is a frame of real play, never a mock-up:
//   start  — Level 1 fresh: 0 found, full time, "Sisa: 7"
//   play   — Level 1 mid-hunt: 3 found with markers, 4 still unfound
//   level2 — Level 2 mid-hunt: 4 found with markers, 4 still unfound
//   end    — Level 1 complete: all 7 markers, "Sisa: 0", win banner
// Any other value (or none) starts a normal fresh game.
export function parseShot() {
  const params = new URLSearchParams(window.location.search);
  return {
    shot: params.get('shot') || '',
    seed: Number(params.get('seed') || '1'),
  };
}

export function stageShot(state, shot) {
  if (shot === 'play') {
    state.levelIndex = 0;
    state.found = new Set([0, 2, 4]);
    state.timeLeft = 87;
    state.hintsLeft = 2;
    state.score = 320;
    return { frozen: true, banner: '' };
  }
  if (shot === 'level2') {
    state.levelIndex = 1;
    state.found = new Set([0, 1, 4, 6]);
    state.timeLeft = 64;
    state.hintsLeft = 1;
    state.score = 780;
    return { frozen: true, banner: '' };
  }
  if (shot === 'end') {
    state.levelIndex = 0;
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.timeLeft = 34;
    state.hintsLeft = 3;
    state.score = 950;
    state.complete = true;
    return { frozen: true, banner: 'Level Selesai! Semua 7 perbedaan ketemu. Skor 950.' };
  }
  // start (and default): fresh Level 1.
  state.levelIndex = 0;
  state.found = new Set();
  state.timeLeft = 120;
  state.hintsLeft = 3;
  state.score = 0;
  return { frozen: true, banner: '' };
}
