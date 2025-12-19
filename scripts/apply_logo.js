
const sharp = require('sharp');
const fs = require('fs');

async function applyLogo(basePath, logoPath, outputPath, scale = 0.2, posX = 0.5, posY = 0.5) {
    try {
        console.log(`Processing ${basePath}...`);

        const base = sharp(basePath);
        const metadata = await base.metadata();
        const width = metadata.width;
        const height = metadata.height;

        const logo = sharp(logoPath);
        const logoMeta = await logo.metadata();

        const targetWidth = Math.round(width * scale);
        const resizedLogo = await logo.resize({ width: targetWidth }).toBuffer();

        // Get dimensions of resized logo
        const resizedMeta = await sharp(resizedLogo).metadata();

        const left = Math.round((width * posX) - (resizedMeta.width / 2));
        const top = Math.round((height * posY) - (resizedMeta.height / 2));

        await base
            .composite([{ input: resizedLogo, top: top, left: left }])
            .toFile(outputPath);

        console.log(`Saved to ${outputPath}`);
    } catch (error) {
        console.error(`Error processing ${basePath}:`, error);
    }
}

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Usage: node apply_logo.js <base> <logo> <output> [scale] [pos_x] [pos_y]");
    process.exit(1);
}

const [base, logo, out, scaleStr, pxStr, pyStr] = args;
const scale = scaleStr ? parseFloat(scaleStr) : 0.2;
const px = pxStr ? parseFloat(pxStr) : 0.5;
const py = pyStr ? parseFloat(pyStr) : 0.5;

applyLogo(base, logo, out, scale, px, py);
