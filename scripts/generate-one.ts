import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

async function generateOne(filename: string, prompt: string, size: string) {
  const outputPath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(outputPath)) {
    console.log(`[SKIP] ${filename}`);
    return;
  }

  try {
    console.log(`[GEN] ${filename}...`);
    const zai = await ZAI.create();
    const response = await zai.images.generations.create({
      prompt,
      size: size as any,
    });
    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`[OK] ${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
  } catch (error: any) {
    console.error(`[ERR] ${filename}: ${error.message}`);
    process.exit(1);
  }
}

const filename = process.argv[2];
const prompt = process.argv[3];
const size = process.argv[4] || '1024x1024';

if (!filename || !prompt) {
  console.error('Usage: bun generate-one.ts <filename> <prompt> [size]');
  process.exit(1);
}

generateOne(filename, prompt, size);
