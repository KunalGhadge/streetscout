import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

interface ImageTask {
  filename: string;
  prompt: string;
  size: string;
}

const tasks: ImageTask[] = [
  {
    filename: 'product-demonslayer.png',
    size: '864x1152',
    prompt: 'Premium anime streetwear jersey product photography, black athletic jersey with crimson red flame patterns and checkered haori-inspired design elements, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-sololeveling.png',
    size: '864x1152',
    prompt: 'Premium anime streetwear jersey product photography, black athletic jersey with electric purple shadow monarch crown emblem and glowing magical rune patterns, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'universe-naruto.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric scene representing ninja village at night, swirling orange energy spirals, autumn leaves falling, dramatic shadows, deep blacks with orange glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-onepiece.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric ocean scene at stormy night, massive crashing waves, crimson red sky, pirate ship silhouette in distance, dramatic lightning, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-jjk.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric scene of cursed energy domain, electric purple and violet energy swirling, cracked ground, occult symbols floating, dramatic shadows, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-aot.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric scene of walled city under siege, massive stone walls, smoke and fire, military green and grey tones, dramatic apocalyptic sky, deep blacks, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-demonslayer.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric scene of bamboo forest at night, floating fire embers, crimson red moon, misty atmosphere, dramatic shadows, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-sololeveling.png',
    size: '1024x1024',
    prompt: 'Dark moody atmospheric scene of dungeon portal with glowing electric purple magic gates, floating blue ice shards, shadowy fog, dramatic lighting, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'lifestyle-college.png',
    size: '1344x768',
    prompt: 'Dark editorial fashion lookbook photo, young person wearing black anime streetwear jersey walking on modern university campus at dusk, moody lighting, cinematic composition, premium streetwear aesthetic, deep blacks, subtle film grain, no text, no watermark, high quality fashion photography',
  },
  {
    filename: 'lifestyle-streetwear.png',
    size: '1344x768',
    prompt: 'Dark editorial streetwear fashion photo, young person in black anime jersey standing in Tokyo alley at night, neon signs reflecting, urban cyberpunk aesthetic, moody cinematic lighting, premium fashion editorial, deep blacks, film grain, no text, no watermark, high quality',
  },
  {
    filename: 'lifestyle-gaming.png',
    size: '1344x768',
    prompt: 'Dark moody gaming setup photo, person wearing black anime jersey at gaming desk, RGB keyboard glow, multiple monitors with abstract purple and blue light, cinematic atmospheric lighting, premium tech lifestyle aesthetic, deep blacks, no text, no watermark, high quality',
  },
  {
    filename: 'lifestyle-animeevent.png',
    size: '1344x768',
    prompt: 'Dark editorial photo of anime convention crowd at night, people in dark streetwear, glowing event lights, atmospheric haze, cinematic wide shot, premium event photography, deep blacks with colorful light bokeh, film grain, no text, no watermark, high quality',
  },
];

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const task of tasks) {
    const outputPath = path.join(OUTPUT_DIR, task.filename);

    if (fs.existsSync(outputPath)) {
      console.log(`[SKIP] ${task.filename}`);
      success++;
      continue;
    }

    try {
      // Create a fresh ZAI instance for each request
      const zai = await ZAI.create();
      console.log(`[GEN] ${task.filename}...`);
      const response = await zai.images.generations.create({
        prompt: task.prompt,
        size: task.size as any,
      });

      const buffer = Buffer.from(response.data[0].base64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`[OK]  ${task.filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
      success++;
    } catch (error: any) {
      console.error(`[ERR] ${task.filename}: ${error.message}`);
      failed++;
    }

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
  process.exit(0);
}

generateAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
