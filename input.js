// Mouse and keyboard input for the hunt.
// Mouse: click either panel; the click is mapped into panel coordinates
// (both panels share the same 600 x 400 space) and checked against the
// level's unfound differences. Keyboard: arrow keys move a crosshair,
// Enter or Space checks the crosshair's spot, H asks for a hint, R restarts
// the level, M mutes, 1/2/3 jump between levels, N goes to the next level
// once the current one is complete.
import { PANEL_W, PANEL_H } from './scenes.js';

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

/** Find an unfound difference within `radius` of a point, or -1. */
export function hitTest(level, found, x, y) {
  for (let i = 0; i < level.differences.length; i += 1) {
    if (found.has(i)) continue;
    const d = level.differences[i];
    const dx = x - d.x;
    const dy = y - d.y;
    const reach = d.r + 10;
    if (dx * dx + dy * dy <= reach * reach) return i;
  }
  return -1;
}

export function bindInput(handlers) {
  const { onPick, onHint, onRestart, onMute, onLevel, onNext, getCursor, setCursor } = handlers;

  function pickAt(x, y) {
    onPick(x, y);
  }

  document.querySelectorAll('canvas.panel').forEach((canvas) => {
    canvas.addEventListener('click', (event) => {
      const p = canvasPoint(canvas, event);
      pickAt(p.x, p.y);
    });
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'h' || key === 'H') {
      event.preventDefault();
      onHint();
      return;
    }
    if (key === 'r' || key === 'R') {
      event.preventDefault();
      onRestart();
      return;
    }
    if (key === 'm' || key === 'M') {
      event.preventDefault();
      onMute();
      return;
    }
    if (key === 'n' || key === 'N') {
      event.preventDefault();
      onNext();
      return;
    }
    if (key === '1' || key === '2' || key === '3') {
      event.preventDefault();
      onLevel(Number(key) - 1);
      return;
    }
    const step = event.shiftKey ? 24 : 10;
    const cursor = getCursor();
    if (!cursor) return;
    let moved = true;
    if (key === 'ArrowLeft') cursor.x = Math.max(0, cursor.x - step);
    else if (key === 'ArrowRight') cursor.x = Math.min(PANEL_W, cursor.x + step);
    else if (key === 'ArrowUp') cursor.y = Math.max(0, cursor.y - step);
    else if (key === 'ArrowDown') cursor.y = Math.min(PANEL_H, cursor.y + step);
    else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      pickAt(cursor.x, cursor.y);
      moved = false;
    } else moved = false;
    if (moved) {
      event.preventDefault();
      setCursor(cursor);
    }
  });
}
