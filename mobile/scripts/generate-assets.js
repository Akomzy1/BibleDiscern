/**
 * generate-assets.js
 *
 * Converts SVG source files to PNG assets required by Expo.
 *
 * Prerequisites:
 *   npm install --save-dev sharp
 *
 * Usage:
 *   node scripts/generate-assets.js
 *
 * Outputs:
 *   assets/icon.png        — 1024×1024  (iOS App Store icon)
 *   assets/icon-android.png— 512×512   (Android adaptive icon foreground)
 *   assets/splash.png      — 1284×2778 (iPhone 14 Pro Max splash, Expo crops for other sizes)
 *   assets/notification-icon.png — 96×96 (Android notification icon, white on transparent)
 */

const fs   = require('fs');
const path = require('path');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error(
      '\n⚠️  sharp is not installed.\n' +
      'Run: npm install --save-dev sharp\n' +
      'Then re-run: node scripts/generate-assets.js\n'
    );
    process.exit(1);
  }

  const ROOT   = path.resolve(__dirname, '..');
  const SVG    = path.join(ROOT, 'assets', 'svg');
  const ASSETS = path.join(ROOT, 'assets');

  fs.mkdirSync(ASSETS, { recursive: true });

  const jobs = [
    // iOS app icon 1024×1024
    {
      input:  path.join(SVG, 'icon.svg'),
      output: path.join(ASSETS, 'icon.png'),
      width:  1024,
      height: 1024,
    },
    // Android adaptive icon foreground 512×512
    {
      input:  path.join(SVG, 'icon.svg'),
      output: path.join(ASSETS, 'icon-android.png'),
      width:  512,
      height: 512,
    },
    // Splash screen (iPhone 14 Pro Max resolution)
    {
      input:  path.join(SVG, 'splash.svg'),
      output: path.join(ASSETS, 'splash.png'),
      width:  1284,
      height: 2778,
    },
    // Favicon for web (if needed)
    {
      input:  path.join(SVG, 'icon.svg'),
      output: path.join(ASSETS, 'favicon.png'),
      width:  32,
      height: 32,
    },
  ];

  for (const job of jobs) {
    if (!fs.existsSync(job.input)) {
      console.warn(`⚠️  Source not found, skipping: ${job.input}`);
      continue;
    }

    await sharp(job.input, { density: 300 })
      .resize(job.width, job.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(job.output);

    const size = (fs.statSync(job.output).size / 1024).toFixed(1);
    console.log(`✓  ${path.relative(ROOT, job.output)}  (${job.width}×${job.height}, ${size} KB)`);
  }

  console.log('\n✅  Asset generation complete.');
  console.log('   Review assets/ and commit icon.png, icon-android.png, splash.png.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
