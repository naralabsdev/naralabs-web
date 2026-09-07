import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const faviconSource = path.join(publicDir, "logo-single-dark.png");

async function createSquareIcon(source, destination, size) {
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 90,
    })
    .toFile(destination);
}

async function createIcoBuffer(source) {
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
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
  await createSquareIcon(faviconSource, path.join(publicDir, "icon.png"), 32);
  await createSquareIcon(faviconSource, path.join(publicDir, "apple-icon.png"), 180);

  const favicon = await createIcoBuffer(faviconSource);
  await writeFile(path.join(publicDir, "favicon.ico"), favicon);

  console.log("Generated favicon assets from logo-single-dark.png");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
