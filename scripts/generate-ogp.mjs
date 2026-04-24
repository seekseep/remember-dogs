import { createCanvas, Image, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/ヒラギノ丸ゴ ProN W4.ttc",
  "HiraginoMaru"
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "public", "ogp.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Twemoji SVG URLs
// 🐕 = U+1F415
const DOG_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f415.svg";
// 🏚️ = U+1F3DA + U+FE0F
const HOUSE_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f3da.svg";

async function fetchImage(url, renderSize = 512) {
  const res = await fetch(url);
  const svgText = await res.text();
  // Inject width/height to rasterize SVG at high resolution
  const highResSvg = svgText.replace(
    "<svg",
    `<svg width="${renderSize}" height="${renderSize}"`
  );
  const img = new Image();
  img.src = Buffer.from(highResSvg);
  return img;
}

async function main() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background - warm beige (#FFF8F0)
  ctx.fillStyle = "#FFF8F0";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle pattern dots
  ctx.fillStyle = "rgba(180, 140, 100, 0.06)";
  for (let x = 0; x < WIDTH; x += 30) {
    for (let y = 0; y < HEIGHT; y += 30) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Load emoji images
  const [dogImg, houseImg] = await Promise.all([
    fetchImage(DOG_URL),
    fetchImage(HOUSE_URL),
  ]);

  // Draw house (center-left)
  const houseSize = 200;
  ctx.drawImage(houseImg, 300, 160, houseSize, houseSize);

  // Draw dogs around the house
  const dogSize = 140;

  // Dog 1: right side of house, facing left (default)
  ctx.drawImage(dogImg, 520, 220, dogSize, dogSize);

  // Dog 2: left side, flipped (facing right)
  ctx.save();
  ctx.translate(260, 240);
  ctx.scale(-1, 1);
  ctx.drawImage(dogImg, 0, 0, dogSize * 0.9, dogSize * 0.9);
  ctx.restore();

  // Dog 3: far right, smaller
  ctx.drawImage(dogImg, 680, 250, dogSize * 0.7, dogSize * 0.7);

  // Title
  ctx.fillStyle = "#3D2C1E";
  ctx.font = "bold 72px HiraginoMaru, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Remember Dogs", WIDTH / 2, 420);

  // Subtitle
  ctx.fillStyle = "#8B7355";
  ctx.font = "32px HiraginoMaru, sans-serif";
  ctx.fillText("犬の数を記憶するゲーム", WIDTH / 2, 510);

  // Border
  ctx.strokeStyle = "rgba(180, 140, 100, 0.2)";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, WIDTH - 8, HEIGHT - 8);

  // Save
  const pngBuffer = canvas.toBuffer("image/png");
  writeFileSync(OUTPUT_PATH, pngBuffer);
  console.log(`OGP image saved to ${OUTPUT_PATH}`);
}

main().catch(console.error);
