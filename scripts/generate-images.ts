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
  // Hero background - cinematic dark anime cyberpunk street
  {
    filename: 'hero-bg.png',
    size: '1344x768',
    prompt:
      'Cinematic dark anime cyberpunk Tokyo street at night, heavy rain, neon reflections on wet asphalt, lone figure in hoodie silhouette, dramatic moody lighting, deep blacks, subtle crimson red glow accents, premium luxury fashion editorial aesthetic, Japanese streetwear vibe, ultra wide cinematic composition, film grain, atmospheric fog, no text, no watermark, high quality, 8k',
  },
  // Product jerseys - front views, premium product photography style
  {
    filename: 'product-naruto.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, black athletic jersey with orange flame patterns and subtle swirl designs, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-onepiece.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, black athletic jersey with crimson red skull and crossbones motif and ocean wave patterns, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-jjk.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, black athletic jersey with electric purple cursed energy swirl patterns and geometric occult symbols, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-aot.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, dark charcoal athletic jersey with military green wings of freedom emblem and survey corps insignia details, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-demonslayer.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, black athletic jersey with crimson red flame patterns and checkered haori-inspired design elements, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  {
    filename: 'product-sololeveling.png',
    size: '864x1152',
    prompt:
      'Premium anime streetwear jersey product photography, black athletic jersey with electric purple shadow monarch crown emblem and glowing magical rune patterns, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic',
  },
  // Universe tiles - atmospheric, editorial, no characters
  {
    filename: 'universe-naruto.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric scene representing ninja village at night, swirling orange energy spirals, autumn leaves falling, dramatic shadows, deep blacks with orange glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-onepiece.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric ocean scene at stormy night, massive crashing waves, crimson red sky, pirate ship silhouette in distance, dramatic lightning, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-jjk.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric scene of cursed energy domain, electric purple and violet energy swirling, cracked ground, occult symbols floating, dramatic shadows, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-aot.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric scene of walled city under siege, massive stone walls, smoke and fire, military green and grey tones, dramatic apocalyptic sky, deep blacks, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-demonslayer.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric scene of bamboo forest at night, floating fire embers, crimson red moon, misty atmosphere, dramatic shadows, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  {
    filename: 'universe-sololeveling.png',
    size: '1024x1024',
    prompt:
      'Dark moody atmospheric scene of dungeon portal with glowing electric purple magic gates, floating blue ice shards, shadowy fog, dramatic lighting, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic',
  },
  // Lifestyle images - real-world scenarios, lookbook style
  {
    filename: 'lifestyle-college.png',
    size: '1344x768',
    prompt:
      'Dark editorial fashion lookbook photo, young person wearing black anime streetwear jersey walking on modern university campus at dusk, moody lighting, cinematic composition, premium streetwear aesthetic, deep blacks, subtle film grain, no text, no watermark, high quality fashion photography',
  },
  {
    filename: 'lifestyle-streetwear.png',
    size: '1344x768',
    prompt:
      'Dark editorial streetwear fashion photo, young person in black anime jersey standing in Tokyo alley at night, neon signs reflecting, urban cyberpunk aesthetic, moody cinematic lighting, premium fashion editorial, deep blacks, film grain, no text, no watermark, high quality',
  },
  {
    filename: 'lifestyle-gaming.png',
    size: '1344x768',
    prompt:
      'Dark moody gaming setup photo, person wearing black anime jersey at gaming desk, RGB keyboard glow, multiple monitors with abstract purple and blue light, cinematic atmospheric lighting, premium tech lifestyle aesthetic, deep blacks, no text, no watermark, high quality',
  },
  {
    filename: 'lifestyle-animeevent.png',
    size: '1344x768',
    prompt:
      'Dark editorial photo of anime convention crowd at night, people in dark streetwear, glowing event lights, atmospheric haze, cinematic wide shot, premium event photography, deep blacks with colorful light bokeh, film grain, no text, no watermark, high quality',
  },
];

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const zai = await ZAI.create();
  let success = 0;
  let failed = 0;

  for (const task of tasks) {
    const outputPath = path.join(OUTPUT_DIR, task.filename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`[SKIP] ${task.filename} already exists`);
      success++;
      continue;
    }

    try {
      console.log(`[GEN] Generating ${task.filename} (${task.size})...`);
      const response = await zai.images.generations.create({
        prompt: task.prompt,
        size: task.size as any,
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`[OK]  ${task.filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
      success++;
    } catch (error: any) {
      console.error(`[ERR] ${task.filename}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} success, ${failed} failed`);
}

generateAll().catch(console.error);
