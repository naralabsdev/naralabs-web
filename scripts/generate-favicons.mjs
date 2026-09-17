import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const faviconDir = path.join(publicDir, "favicon");
const faviconSource = path.join(publicDir, "logo-single-light.png");

const PNG_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

const ICO_SIZES = [16, 32, 48];

async function createSquareIcon(source, destination, size) {
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({
      compressionLevel: 9,
      palette: size <= 32,
      quality: 90,
    })
    .toFile(destination);
}

async function createIcoBuffer(source) {
  const pngBuffers = await Promise.all(
    ICO_SIZES.map((size) =>
      sharp(source)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  );

  return toIco(pngBuffers);
}

async function main() {
  await mkdir(faviconDir, { recursive: true });

  for (const { name, size } of PNG_SIZES) {
    await createSquareIcon(faviconSource, path.join(faviconDir, name), size);
  }

  const faviconIco = await createIcoBuffer(faviconSource);
  const faviconIcoPath = path.join(faviconDir, "favicon.ico");
  await writeFile(faviconIcoPath, faviconIco);

  const manifest = {
    name: "Naralabs Explorer",
    short_name: "Naralabs",
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#4A148C",
    background_color: "#ffffff",
    display: "standalone",
  };

  await writeFile(
    path.join(faviconDir, "site.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log("Generated favicon assets in public/favicon/ from logo-single-light.png");
  console.log("  - favicon.ico (16/32/48)");
  console.log("  - favicon-16x16.png");
  console.log("  - favicon-32x32.png");
  console.log("  - apple-touch-icon.png");
  console.log("  - android-chrome-192x192.png");
  console.log("  - android-chrome-512x512.png");
  console.log("  - site.webmanifest");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
