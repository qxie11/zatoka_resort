import html2canvas from "html2canvas";

interface Particle {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  vx: number;
  vy: number;
  size: number;
  delay: number;
  life: number;
  maxLife: number;
}

export async function thanosSnap(element: HTMLElement, callback: () => void) {
  try {
    // 1. Capture the element's screenshot using html2canvas
    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const rect = element.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      callback();
      return;
    }

    const width = rect.width;
    const height = rect.height;
    
    // Get image data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // 2. Create the particle overlay canvas
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = width * 1.5; // Extra space to the right for particles to drift
    overlayCanvas.height = height * 1.5; // Extra space for particles to drift
    overlayCanvas.style.position = "fixed";
    overlayCanvas.style.left = `${rect.left}px`;
    overlayCanvas.style.top = `${rect.top}px`;
    overlayCanvas.style.pointerEvents = "none";
    overlayCanvas.style.zIndex = "9999";
    document.body.appendChild(overlayCanvas);

    const overlayCtx = overlayCanvas.getContext("2d");
    if (!overlayCtx) {
      document.body.removeChild(overlayCanvas);
      callback();
      return;
    }

    // Hide original element
    const originalVisibility = element.style.visibility;
    element.style.visibility = "hidden";

    // 3. Generate particles
    const particles: Particle[] = [];
    const step = 4; // Sample every 4th pixel for performance and dust-like feel

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        if (a > 0) {
          // Map to overlay coordinates
          const posX = (x / canvas.width) * width;
          const posY = (y / canvas.height) * height;

          // Thanos snap sweep starts from left to right
          const delay = (posX / width) * 600; // Sweep delay in ms

          // Random dust velocity
          const vx = (Math.random() - 0.2) * 1.5 + 0.8; // Drift rightwards
          const vy = (Math.random() - 0.5) * 1.2 - 0.5; // Drift upwards

          particles.push({
            x: posX,
            y: posY,
            r,
            g,
            b,
            a,
            vx,
            vy,
            size: Math.random() * 2 + 1,
            delay,
            life: 0,
            maxLife: 60 + Math.random() * 40, // frames
          });
        }
      }
    }

    // 4. Animate loop
    const startTime = performance.now();
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      overlayCtx!.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

      let activeParticles = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (elapsed < p.delay) {
          // Drawing the original element parts that haven't dissolved yet
          overlayCtx!.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a / 255})`;
          overlayCtx!.fillRect(p.x, p.y, p.size, p.size);
          activeParticles++;
          continue;
        }

        if (p.life < p.maxLife) {
          // Particle is dissolving / flying
          const ratio = p.life / p.maxLife;
          const currentX = p.x + p.vx * p.life;
          const currentY = p.y + p.vy * p.life;
          // Fade out, add blur/dissolve effect
          const alpha = (p.a / 255) * (1 - ratio);
          
          overlayCtx!.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
          overlayCtx!.fillRect(currentX, currentY, p.size, p.size);
          
          p.life++;
          activeParticles++;
        }
      }

      if (activeParticles > 0 && elapsed < 2500) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup and trigger callback
        document.body.removeChild(overlayCanvas);
        element.style.display = "";
        element.style.visibility = "";
        callback();
      }
    }

    requestAnimationFrame(animate);
  } catch (err) {
    console.error("Thanos snap failed, falling back to instant delete", err);
    callback();
  }
}
