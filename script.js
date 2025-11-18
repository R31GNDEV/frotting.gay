const canvas = document.getElementById("toyCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;

  // internal pixel size
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;

  // normalize drawing coords back to CSS pixels
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ----- IMAGE SETUP -----
const toyImg = new Image();
toyImg.src = "images/dildo.png"; // make sure this path is correct

function drawImageToy(x, y, angle, scale = 1) {
  // image not ready yet
  if (!toyImg.naturalWidth || !toyImg.naturalHeight) return;

  const w = toyImg.naturalWidth * scale;
  const h = toyImg.naturalHeight * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // center the image on (x, y)
  ctx.drawImage(toyImg, -w / 2, -h / 2, w, h);

  ctx.restore();
}

let t = 0;

function animate() {
  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  // soft ambient glow
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    8,
    w / 2,
    h / 2,
    Math.max(w, h)
  );
  g.addColorStop(0, "rgba(255,255,255,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0.98)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // center of canvas
  const centerX = w / 2;
  const centerY = h / 2;

  // motion
  const slide = Math.sin(t) * 26; // horizontal sliding
  const press = Math.cos(t) * 6;  // in/out "pressure"

  // left dildo
drawImageToy(
  centerX - 50 + slide / 2,
  centerY + press,
  Math.PI / 6,   // <-- flipped
  0.55
);

// right dildo flipped direction
drawImageToy(
  centerX + 40 - slide / 2,
  centerY - press,
  -Math.PI / 6,  // <-- flipped
  0.55
);

  t += 0.04;
  requestAnimationFrame(animate);
}

// start animating only once the image is loaded
toyImg.onload = () => {
  animate();
};
