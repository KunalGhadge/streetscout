#!/bin/bash
cd /home/z/my-project

generate() {
  local filename=$1
  local prompt=$2
  local size=$3
  local filepath="public/images/$filename"

  if [ -f "$filepath" ]; then
    echo "[SKIP] $filename already exists"
    return 0
  fi

  echo "[GEN] $filename..."
  timeout 120 z-ai image -p "$prompt" -o "./$filepath" -s "$size" 2>&1 | tail -1
  if [ -f "$filepath" ]; then
    echo "[OK]  $filename ($(du -h "$filepath" | cut -f1))"
  else
    echo "[ERR] $filename failed"
  fi
}

# Product - Solo Leveling
generate "product-sololeveling.png" "Premium anime streetwear jersey product photography, black athletic jersey with electric purple shadow monarch crown emblem and glowing magical rune patterns, displayed on invisible mannequin, pure black background, dramatic studio lighting from left, high-end fashion editorial style, ultra detailed fabric texture, centered composition, no text, no watermark, luxury sportswear aesthetic" "864x1152"

# Universes
generate "universe-naruto.png" "Dark moody atmospheric scene representing ninja village at night, swirling orange energy spirals, autumn leaves falling, dramatic shadows, deep blacks with orange glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

generate "universe-onepiece.png" "Dark moody atmospheric ocean scene at stormy night, massive crashing waves, crimson red sky, pirate ship silhouette in distance, dramatic lightning, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

generate "universe-jjk.png" "Dark moody atmospheric scene of cursed energy domain, electric purple and violet energy swirling, cracked ground, occult symbols floating, dramatic shadows, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

generate "universe-aot.png" "Dark moody atmospheric scene of walled city under siege, massive stone walls, smoke and fire, military green and grey tones, dramatic apocalyptic sky, deep blacks, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

generate "universe-demonslayer.png" "Dark moody atmospheric scene of bamboo forest at night, floating fire embers, crimson red moon, misty atmosphere, dramatic shadows, deep blacks with red glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

generate "universe-sololeveling.png" "Dark moody atmospheric scene of dungeon portal with glowing electric purple magic gates, floating blue ice shards, shadowy fog, dramatic lighting, deep blacks with purple glow accents, premium editorial photography style, no characters, no text, abstract symbolic representation, high quality, cinematic" "1024x1024"

# Lifestyle
generate "lifestyle-college.png" "Dark editorial fashion lookbook photo, young person wearing black anime streetwear jersey walking on modern university campus at dusk, moody lighting, cinematic composition, premium streetwear aesthetic, deep blacks, subtle film grain, no text, no watermark, high quality fashion photography" "1344x768"

generate "lifestyle-streetwear.png" "Dark editorial streetwear fashion photo, young person in black anime jersey standing in Tokyo alley at night, neon signs reflecting, urban cyberpunk aesthetic, moody cinematic lighting, premium fashion editorial, deep blacks, film grain, no text, no watermark, high quality" "1344x768"

generate "lifestyle-gaming.png" "Dark moody gaming setup photo, person wearing black anime jersey at gaming desk, RGB keyboard glow, multiple monitors with abstract purple and blue light, cinematic atmospheric lighting, premium tech lifestyle aesthetic, deep blacks, no text, no watermark, high quality" "1344x768"

generate "lifestyle-animeevent.png" "Dark editorial photo of anime convention crowd at night, people in dark streetwear, glowing event lights, atmospheric haze, cinematic wide shot, premium event photography, deep blacks with colorful light bokeh, film grain, no text, no watermark, high quality" "1344x768"

echo ""
echo "=== DONE ==="
ls -la public/images/
