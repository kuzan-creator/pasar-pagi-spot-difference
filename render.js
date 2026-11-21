// Draws both panels of the current level onto their canvases, plus the
// found markers, the miss flash, the keyboard cursor and the hint pulse.
// Panels are drawn from the same scene painter, so the only visual
// differences between them are the level's own differences.
import { PANEL_W, PANEL_H } from './scenes.js';

/** Draw one panel. `found` is a Set of difference indexes already found. */
export function drawPanel(ctx, level, variant, found, flash) {
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  ctx.save();
  level.draw(ctx, variant);
  ctx.restore();
  // Green rings + ticks on every difference already found, on both panels.
  found.forEach((index) => {
    const d = level.differences[index];
    ctx.strokeStyle = '#1faa53';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#1faa53';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(d.x - 8, d.y);
    ctx.lineTo(d.x - 2, d.y + 7);
    ctx.lineTo(d.x + 10, d.y - 7);
    ctx.stroke();
  });
  // Red X where the player just clicked wrong.
  if (flash) {
    ctx.strokeStyle = '#e33e2b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(flash.x - 12, flash.y - 12);
    ctx.lineTo(flash.x + 12, flash.y + 12);
    ctx.moveTo(flash.x + 12, flash.y - 12);
    ctx.lineTo(flash.x - 12, flash.y + 12);
    ctx.stroke();
  }
}

/** Draw the keyboard cursor (a crosshair) on the active panel. */
export function drawCursor(ctx, pos, active) {
  if (!pos) return;
  ctx.strokeStyle = active ? '#7a4a21' : 'rgba(122,74,33,0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 14, 0, Math.PI * 2);
  ctx.moveTo(pos.x - 20, pos.y);
  ctx.lineTo(pos.x - 8, pos.y);
  ctx.moveTo(pos.x + 8, pos.y);
  ctx.lineTo(pos.x + 20, pos.y);
  ctx.moveTo(pos.x, pos.y - 20);
  ctx.lineTo(pos.x, pos.y - 8);
  ctx.moveTo(pos.x, pos.y + 8);
  ctx.lineTo(pos.x, pos.y + 20);
  ctx.stroke();
}

/** Draw the hint pulse: a pulsing ring around one unfound difference. */
export function drawHint(ctx, diff, phase) {
  if (!diff) return;
  const r = diff.r + 6 + Math.sin(phase) * 4;
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}
