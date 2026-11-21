// The three scenes of "Pasar Pagi — Cari Bedanya!".
// Every scene is drawn twice from the same painter: variant 'A' is the left
// picture, variant 'B' is the right picture with the level's differences
// applied. Both panels share one coordinate system (600 x 400), so a
// difference's x/y means the same spot on both sides. Nothing here loads
// from the network: every pixel is drawn with canvas primitives.
//
// Levels:
//   1. Lapak Buah — 7 differences, 120 seconds (easy, learn the hunt)
//   2. Warung Kopi — 8 differences, 105 seconds (medium)
//   3. Taman Bermain — 9 differences, 90 seconds (hard, smaller marks)

export const PANEL_W = 600;
export const PANEL_H = 400;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function text(ctx, str, x, y, size, fill, align) {
  ctx.fillStyle = fill;
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 250);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, 250);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 22 * s, y + 5 * s, 22 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 24 * s, y + 5 * s, 24 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function sun(ctx, x, y) {
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * 34, y + Math.sin(a) * 34);
    ctx.lineTo(x + Math.cos(a) * 44, y + Math.sin(a) * 44);
    ctx.stroke();
  }
  circle(ctx, x, y, 28, '#ffd93b');
  circle(ctx, x - 9, y - 6, 4, '#c98f00');
  circle(ctx, x + 10, y + 8, 3, '#c98f00');
}

function ground(ctx, fill) {
  rect(ctx, 0, 240, PANEL_W, 160, fill);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let i = 0; i < 10; i += 1) {
    ctx.fillRect(20 + i * 58, 262 + (i % 3) * 44, 26, 4);
  }
}

function basket(ctx, x, y, fruits) {
  // A woven basket with round fruit in it.
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath();
  ctx.moveTo(x - 42, y);
  ctx.lineTo(x + 42, y);
  ctx.lineTo(x + 32, y + 26);
  ctx.lineTo(x - 32, y + 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6b421e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 38, y + 9);
  ctx.lineTo(x + 38, y + 9);
  ctx.moveTo(x - 34, y + 18);
  ctx.lineTo(x + 34, y + 18);
  ctx.stroke();
  fruits.forEach((f) => circle(ctx, x + f[0], y + f[1], f[2], f[3]));
}

function drawLapakBuah(ctx, variant) {
  const b = variant === 'B';
  sky(ctx, '#8ec9ee', '#dff3ff');
  if (!b) sun(ctx, 520, 55);
  else cloud(ctx, 520, 55, 1.1);
  cloud(ctx, 120, 52, 1);
  cloud(ctx, 310, 38, 0.8);
  // Distant green hills.
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.moveTo(0, 240);
  ctx.quadraticCurveTo(150, 190, 320, 240);
  ctx.quadraticCurveTo(460, 205, 600, 240);
  ctx.lineTo(600, 250);
  ctx.lineTo(0, 250);
  ctx.closePath();
  ctx.fill();
  ground(ctx, '#eac992');
  // Market stall: posts, striped awning, counter.
  rect(ctx, 78, 128, 12, 180, '#7a4a21');
  rect(ctx, 512, 128, 12, 180, '#7a4a21');
  for (let i = 0; i < 9; i += 1) {
    const x0 = 60 + i * 54;
    // Difference 4: in B one red stripe is white, the awning loses a stripe.
    const isMissing = b && i === 4;
    ctx.fillStyle = isMissing || i % 2 === 1 ? '#fff7ec' : '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(x0, 118);
    ctx.lineTo(x0 + 54, 118);
    ctx.lineTo(x0 + 48, 152);
    ctx.lineTo(x0 + 6, 152);
    ctx.closePath();
    ctx.fill();
  }
  rect(ctx, 60, 152, 480, 8, '#c0392b');
  // Vendor behind the counter.
  circle(ctx, 215, 205, 26, '#f2c89b');
  ctx.fillStyle = '#2e7d6b';
  ctx.beginPath();
  ctx.arc(215, 205, 26, Math.PI * 0.15, Math.PI * 0.85);
  ctx.fill();
  rect(ctx, 185, 228, 60, 62, '#2e7d6b');
  rect(ctx, 195, 228, 40, 62, '#f4f1de');
  circle(ctx, 206, 202, 3, '#222');
  circle(ctx, 224, 202, 3, '#222');
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(215, 210, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // Straw hat.
  ellipse(ctx, 215, 182, 34, 10, '#e8c15a');
  ellipse(ctx, 215, 178, 20, 12, '#e8c15a');
  rect(ctx, 60, 288, 480, 16, '#8d5a2b');
  rect(ctx, 60, 304, 480, 10, '#6b421e');
  // Baskets of fruit on the counter.
  basket(ctx, 140, 262, [[-18, -8, 11, '#e33e2b'], [0, -14, 11, b ? '#7bc043' : '#e33e2b'], [18, -8, 11, '#e33e2b']]);
  basket(ctx, 300, 262, [[-18, -8, 11, '#ff8c1a'], [0, -14, 11, '#ff8c1a'], [18, -8, 11, '#ff8c1a']]);
  // Difference 3: in B one banana is missing from the third basket.
  const bananas = b
    ? [[-16, -10, 9, '#ffe14d'], [12, -8, 9, '#ffe14d']]
    : [[-20, -10, 9, '#ffe14d'], [0, -14, 9, '#ffe14d'], [20, -8, 9, '#ffe14d']];
  basket(ctx, 455, 262, bananas);
  // Price board.
  rect(ctx, 398, 178, 84, 40, '#fffbe8');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 3;
  ctx.strokeRect(398, 178, 84, 40);
  text(ctx, 'BUAH', 440, 190, 13, '#7a4a21');
  text(ctx, b ? '15RB' : '10RB', 440, 208, 15, '#c0392b');
  // Bird on the left post. Difference 7: absent in B.
  if (!b) {
    ctx.fillStyle = '#33415c';
    ellipse(ctx, 84, 112, 10, 7, '#33415c');
    circle(ctx, 92, 106, 5, '#33415c');
    ctx.fillStyle = '#f5b301';
    ctx.beginPath();
    ctx.moveTo(96, 106);
    ctx.lineTo(102, 108);
    ctx.lineTo(96, 110);
    ctx.fill();
  }
  // Cat asleep under the counter. Difference 6: absent in B.
  if (!b) {
    ellipse(ctx, 200, 352, 26, 12, '#9aa0a6');
    circle(ctx, 222, 344, 10, '#9aa0a6');
    ctx.fillStyle = '#9aa0a6';
    ctx.beginPath();
    ctx.moveTo(216, 336);
    ctx.lineTo(219, 328);
    ctx.lineTo(222, 336);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(226, 336);
    ctx.lineTo(229, 328);
    ctx.lineTo(232, 336);
    ctx.fill();
  }
  // Mangoes on the ground, right side.
  circle(ctx, 505, 362, 12, '#ff9f1c');
  circle(ctx, 528, 366, 12, '#ff9f1c');
  circle(ctx, 516, 348, 12, '#ff9f1c');
  // Flowers, left ground.
  circle(ctx, 40, 350, 6, '#e75480');
  circle(ctx, 58, 360, 6, '#e75480');
  circle(ctx, 40, 370, 6, '#e75480');
  text(ctx, 'PASAR PAGI', 300, 388, 13, '#7a4a21');
}

function drawWarungKopi(ctx, variant) {
  const b = variant === 'B';
  sky(ctx, '#ffd9a0', '#fff3d6');
  if (!b) sun(ctx, 90, 60);
  else cloud(ctx, 90, 60, 1);
  cloud(ctx, 320, 45, 0.9);
  cloud(ctx, 500, 80, 0.7);
  ground(ctx, '#d9c39a');
  // The warung: cream walls, brown roof, door and window.
  rect(ctx, 90, 130, 420, 170, '#f7e8c9');
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath();
  ctx.moveTo(70, 135);
  ctx.lineTo(300, 70);
  ctx.lineTo(530, 135);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 70, 130, 460, 10, '#6b421e');
  rect(ctx, 130, 190, 90, 110, '#7a4a21');
  rect(ctx, 140, 200, 70, 90, '#5b3a1a');
  circle(ctx, 205, 245, 4, '#f5b301');
  rect(ctx, 380, 190, 110, 80, '#bfe3f0');
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 4;
  ctx.strokeRect(380, 190, 110, 80);
  ctx.beginPath();
  ctx.moveTo(435, 190);
  ctx.lineTo(435, 270);
  ctx.moveTo(380, 230);
  ctx.lineTo(490, 230);
  ctx.stroke();
  // Wall clock. Difference 8: hands point at 8:00 in A, 9:00 in B.
  circle(ctx, 300, 150, 24, '#ffffff');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 150, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 150);
  ctx.lineTo(300, 132);
  ctx.moveTo(300, 150);
  ctx.lineTo(b ? 316 : 286, 158);
  ctx.stroke();
  // Hanging lamp. Difference 5: lit in A, off in B.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 130);
  ctx.lineTo(300, 168);
  ctx.stroke();
  circle(ctx, 300, 176, 12, b ? '#c9c9c9' : '#ffd93b');
  if (!b) {
    ctx.fillStyle = 'rgba(255, 217, 59, 0.25)';
    ctx.beginPath();
    ctx.arc(300, 176, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  // Menu board. Difference 3: price changes.
  rect(ctx, 500, 150, 78, 56, '#2b2b2b');
  text(ctx, 'KOPI', 539, 166, 13, '#ffe14d');
  text(ctx, b ? '8RB' : '5RB', 539, 188, 16, '#ffffff');
  // Table with cups. Difference 2: three cups in A, two in B.
  ellipse(ctx, 300, 330, 120, 16, '#8d5a2b');
  rect(ctx, 292, 330, 16, 50, '#6b421e');
  const cups = b ? [250, 300] : [240, 300, 360];
  cups.forEach((x) => {
    rect(ctx, x - 14, 296, 28, 22, '#ffffff');
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 14, 296, 28, 22);
    ellipse(ctx, x, 296, 14, 5, '#6b421e');
  });
  // Kettle with steam. Difference 1: steam in A, none in B.
  rect(ctx, 120, 300, 70, 30, '#5b7fa6');
  ctx.beginPath();
  ctx.moveTo(190, 308);
  ctx.lineTo(214, 300);
  ctx.lineTo(190, 316);
  ctx.closePath();
  ctx.fillStyle = '#5b7fa6';
  ctx.fill();
  if (!b) {
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 296);
    ctx.quadraticCurveTo(140, 278, 152, 262);
    ctx.moveTo(165, 296);
    ctx.quadraticCurveTo(175, 276, 163, 258);
    ctx.stroke();
  }
  // Bicycle leaning on the right. Difference 4: absent in B.
  if (!b) {
    ctx.strokeStyle = '#33415c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(500, 352, 20, 0, Math.PI * 2);
    ctx.arc(556, 352, 20, 0, Math.PI * 2);
    ctx.moveTo(500, 352);
    ctx.lineTo(528, 318);
    ctx.lineTo(556, 352);
    ctx.moveTo(528, 318);
    ctx.lineTo(516, 352);
    ctx.stroke();
    circle(ctx, 528, 316, 5, '#33415c');
  }
  // Potted plant. Difference 6: red flowers in A, yellow in B.
  rect(ctx, 60, 330, 40, 30, '#c0392b');
  circle(ctx, 80, 318, 8, '#2e7d32');
  circle(ctx, 72, 306, 6, b ? '#ffd93b' : '#e33e2b');
  circle(ctx, 88, 306, 6, b ? '#ffd93b' : '#e33e2b');
  circle(ctx, 80, 298, 6, b ? '#ffd93b' : '#e33e2b');
  // Cat on a chair. Difference 7: absent in B.
  if (!b) {
    rect(ctx, 420, 330, 60, 10, '#8d5a2b');
    rect(ctx, 426, 340, 8, 30, '#6b421e');
    rect(ctx, 466, 340, 8, 30, '#6b421e');
    ellipse(ctx, 450, 322, 20, 10, '#e8a34c');
    circle(ctx, 466, 314, 9, '#e8a34c');
  }
  text(ctx, 'WARUNG KOPI PAGI', 300, 388, 13, '#7a4a21');
}

function drawTaman(ctx, variant) {
  const b = variant === 'B';
  sky(ctx, '#7ec8f7', '#dff3ff');
  if (!b) sun(ctx, 520, 55);
  else cloud(ctx, 520, 55, 1.1);
  cloud(ctx, 150, 50, 1);
  cloud(ctx, 350, 42, 0.8);
  // Bird. Difference 5: absent in B.
  if (!b) {
    ctx.strokeStyle = '#33415c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(118, 62, 8, Math.PI * 1.1, Math.PI * 1.9);
    ctx.arc(134, 62, 8, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  rect(ctx, 0, 240, PANEL_W, 160, '#69b455');
  // Big tree, left. Difference 7: three apples in A, two in B.
  rect(ctx, 78, 150, 22, 95, '#7a4a21');
  circle(ctx, 90, 120, 52, '#2e7d32');
  circle(ctx, 55, 145, 34, '#2e7d32');
  circle(ctx, 125, 145, 34, '#2e7d32');
  circle(ctx, 62, 128, 7, '#e33e2b');
  circle(ctx, 108, 118, 7, '#e33e2b');
  if (!b) circle(ctx, 88, 142, 7, '#e33e2b');
  // Swing set, centre.
  ctx.strokeStyle = '#5b3a1a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(250, 250);
  ctx.lineTo(268, 150);
  ctx.moveTo(350, 250);
  ctx.lineTo(332, 150);
  ctx.moveTo(258, 150);
  ctx.lineTo(342, 150);
  ctx.stroke();
  // Difference 2: the swing seat is missing in B.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(282, 150);
  ctx.lineTo(282, 226);
  ctx.moveTo(318, 150);
  ctx.lineTo(318, 226);
  ctx.stroke();
  if (!b) rect(ctx, 272, 226, 56, 10, '#e74c3c');
  // Slide, right. Difference 6: blue in A, green in B.
  ctx.fillStyle = b ? '#27ae60' : '#2980b9';
  ctx.beginPath();
  ctx.moveTo(460, 150);
  ctx.lineTo(500, 150);
  ctx.lineTo(560, 300);
  ctx.lineTo(520, 300);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 452, 120, 56, 34, '#8d5a2b');
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(452, 120);
  ctx.lineTo(452, 160);
  ctx.moveTo(508, 120);
  ctx.lineTo(508, 160);
  ctx.stroke();
  // Sandbox with a ball. Difference 3: ball absent in B.
  rect(ctx, 150, 320, 120, 46, '#e8c15a');
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 3;
  ctx.strokeRect(150, 320, 120, 46);
  if (!b) {
    circle(ctx, 210, 342, 16, '#e33e2b');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(210, 342, 16, -0.6, 0.6);
    ctx.stroke();
  }
  // Bench. Difference 8: absent in B.
  if (!b) {
    rect(ctx, 380, 330, 90, 10, '#8d5a2b');
    rect(ctx, 388, 340, 8, 30, '#6b421e');
    rect(ctx, 454, 340, 8, 30, '#6b421e');
    rect(ctx, 380, 312, 90, 8, '#8d5a2b');
  }
  // Kite in the sky. Difference 1: red in A, blue in B.
  ctx.fillStyle = b ? '#2980b9' : '#e33e2b';
  ctx.beginPath();
  ctx.moveTo(450, 55);
  ctx.lineTo(478, 75);
  ctx.lineTo(450, 95);
  ctx.lineTo(424, 75);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(450, 95);
  ctx.lineTo(462, 122);
  ctx.lineTo(446, 140);
  ctx.stroke();
  // Flowers. Difference 4: five in A, four in B.
  const flowers = b
    ? [[500, 362, '#e75480'], [524, 372, '#ffd93b'], [546, 362, '#e75480'], [566, 372, '#ffd93b']]
    : [[500, 362, '#e75480'], [524, 372, '#ffd93b'], [546, 362, '#e75480'], [566, 372, '#ffd93b'], [536, 350, '#e75480']];
  flowers.forEach((f) => circle(ctx, f[0], f[1], 6, f[2]));
  // Butterfly. Difference 9: absent in B.
  if (!b) {
    ellipse(ctx, 244, 118, 7, 10, '#9b59b6');
    ellipse(ctx, 258, 118, 7, 10, '#9b59b6');
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(251, 108);
    ctx.lineTo(251, 128);
    ctx.stroke();
  }
  text(ctx, 'TAMAN BERMAIN', 300, 388, 13, '#1e6b34');
}

export const LEVELS = [
  {
    id: 1,
    name: 'Lapak Buah',
    subtitle: 'Pasar pagi — lapak buah Bu Lastri',
    seconds: 120,
    draw: drawLapakBuah,
    differences: [
      { x: 520, y: 55, r: 30, label: 'Matahari hilang' },
      { x: 150, y: 258, r: 20, label: 'Apel berubah hijau' },
      { x: 455, y: 262, r: 22, label: 'Pisang berkurang satu' },
      { x: 300, y: 138, r: 20, label: 'Garis tenda hilang' },
      { x: 430, y: 198, r: 22, label: 'Harga berubah 10RB ke 15RB' },
      { x: 200, y: 352, r: 24, label: 'Kucing hilang' },
      { x: 85, y: 112, r: 16, label: 'Burung hilang' },
    ],
  },
  {
    id: 2,
    name: 'Warung Kopi',
    subtitle: 'Warung kopi pagi — seduh dulu sebelum berangkat',
    seconds: 105,
    draw: drawWarungKopi,
    differences: [
      { x: 156, y: 278, r: 22, label: 'Uap ketel hilang' },
      { x: 360, y: 306, r: 20, label: 'Cangkir berkurang satu' },
      { x: 539, y: 178, r: 22, label: 'Harga kopi berubah' },
      { x: 528, y: 340, r: 26, label: 'Sepeda hilang' },
      { x: 300, y: 176, r: 20, label: 'Lampu padam' },
      { x: 80, y: 304, r: 20, label: 'Bunga berubah kuning' },
      { x: 450, y: 322, r: 22, label: 'Kucing hilang' },
      { x: 300, y: 150, r: 24, label: 'Jarum jam berubah' },
    ],
  },
  {
    id: 3,
    name: 'Taman Bermain',
    subtitle: 'Taman bermain — cari sampai ketemu semua',
    seconds: 90,
    draw: drawTaman,
    differences: [
      { x: 451, y: 75, r: 22, label: 'Layang-layang berubah biru' },
      { x: 300, y: 231, r: 20, label: 'Jok ayunan hilang' },
      { x: 210, y: 342, r: 20, label: 'Bola hilang' },
      { x: 536, y: 350, r: 20, label: 'Bunga berkurang satu' },
      { x: 126, y: 62, r: 18, label: 'Burung hilang' },
      { x: 510, y: 230, r: 26, label: 'Perosotan berubah hijau' },
      { x: 88, y: 142, r: 18, label: 'Apel pohon berkurang' },
      { x: 425, y: 340, r: 24, label: 'Bangku hilang' },
      { x: 251, y: 118, r: 16, label: 'Kupu-kupu hilang' },
    ],
  },
];
