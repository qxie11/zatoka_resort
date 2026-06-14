"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CuteFishPreloader } from "../ui/CuteFishPreloader";

// Снижаем количество кругов. 8 вполне достаточно для интерактива
const MAX_RIPPLES = 8;

export default function OceanScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;
    const clock = new THREE.Timer();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance"
    });

    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.autoClear = false;

    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      
      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec4 iMouse;
      uniform vec3 uRipples[${MAX_RIPPLES}];
      
      const float PI = 3.141592;
      const float EPSILON = 1e-3;
      #define EPSILON_NRM (0.1 / iResolution.x)

      const vec3 SEA_BASE = vec3(0.0,0.09,0.18);
      const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6)*0.6;
      #define SEA_TIME (1.0 + iTime * 0.8)
      const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

      mat3 fromEuler(vec3 ang) {
          vec2 a1 = vec2(sin(ang.x),cos(ang.x));
          vec2 a2 = vec2(sin(ang.y),cos(ang.y));
          vec2 a3 = vec2(sin(ang.z),cos(ang.z));
          mat3 m;
          m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
          m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
          m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
          return m;
      }
      
      float hash( vec2 p ) {
          float h = dot(p,vec2(127.1,311.7));  
          return fract(sin(h)*43758.5453123);
      }
      
      float noise( in vec2 p ) {
          vec2 i = floor( p );
          vec2 f = fract( p );  
          vec2 u = f*f*(3.0-2.0*f);
          return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), hash( i + vec2(1.0,0.0) ), u.x),
                      mix( hash( i + vec2(0.0,1.0) ), hash( i + vec2(1.0,1.0) ), u.x), u.y);
      }

      float diffuse(vec3 n,vec3 l,float p) {
          return pow(dot(n,l) * 0.4 + 0.6,p);
      }
      
      float specular(vec3 n,vec3 l,vec3 e,float s) {    
          float nrm = (s + 8.0) / (PI * 8.0);
          return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
      }

      vec3 getSkyColor(vec3 e) {
          e.y = (max(e.y,0.0)*0.8+0.2)*0.8;
          return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4) * 1.1;
      }

      float sea_octave(vec2 uv, float choppy) {
          uv += noise(uv);        
          vec2 wv = 1.0-abs(sin(uv));
          vec2 swv = abs(cos(uv));    
          wv = mix(wv,swv,wv);
          return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
      }

      // Базовая геометрия моря
      float map(vec3 p) {
          float freq = 0.16;
          float amp = 0.6;
          float choppy = 4.0;
          vec2 uv = p.xz; uv.x *= 0.75;
          
          float d, h = 0.0;    
          // Оптимизация: убрано лишнее выполнение цикла
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;        
          return p.y - h;
      }

      // Детализированная геометрия
      float map_detailed(vec3 p) {
          float freq = 0.16;
          float amp = 0.6;
          float choppy = 4.0;
          vec2 uv = p.xz; uv.x *= 0.75;
          
          float d, h = 0.0;    
          // Оптимизация: Снижено с 5 до 3 итераций (колоссальный прирост FPS без особой потери качества)
          for(int i = 0; i < 3; i++) {
              d = sea_octave((uv+SEA_TIME)*freq,choppy);
              d += sea_octave((uv-SEA_TIME)*freq,choppy);
              h += d * amp;        
              uv *= octave_m; freq *= 1.9; amp *= 0.22;
              choppy = mix(choppy,1.0,0.2);
          }

          float ripple = 0.0;
          for(int j = 0; j < ${MAX_RIPPLES}; j++) {
              float age = iTime - uRipples[j].z;
              if(age > 0.0 && age < 4.0) {
                  float dist = length(p.xz - uRipples[j].xy);
                  float front = age * 6.0; 
                  float diff = dist - front;
                  if(diff < 1.0 && diff > -2.5) {
                      float env = smoothstep(1.0, 0.0, abs(diff + 0.75) - 0.75);
                      float wave = sin(dist * 5.0 - age * 30.0);
                      float decay = exp(-age * 1.5); 
                      ripple += wave * env * decay * 0.8;
                  }
              }
          }
          h += ripple;
          return p.y - h;
      }

      vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
          float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0);
          fresnel = min(fresnel * fresnel * fresnel, 0.5);
          
          vec3 reflected = getSkyColor(reflect(eye, n));    
          vec3 refracted = SEA_BASE + diffuse(n, l, 80.0) * SEA_WATER_COLOR * 0.12; 
          vec3 color = mix(refracted, reflected, fresnel);
          
          float atten = max(1.0 - dot(dist, dist) * 0.001, 0.0);
          color += SEA_WATER_COLOR * (p.y - 0.6) * 0.18 * atten;
          color += specular(n, l, eye, 60.0);
          return color;
      }

      vec3 getNormal(vec3 p, float eps) {
          vec3 n;
          n.y = map_detailed(p);    
          n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
          n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
          n.y = eps;
          return normalize(n);
      }

      float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
          float tm = 0.0;
          float tx = 1000.0;    
          float hx = map(ori + dir * tx);
          if(hx > 0.0) {
              p = ori + dir * tx;
              return tx;   
          }
          float hm = map(ori);    
          // Оптимизация: Жестко ограничено 32 итерациями, убран лишний if
          for(int i = 0; i < 32; i++) {
              float tmid = mix(tm, tx, hm / (hm - hx));
              p = ori + dir * tmid;
              float hmid = map(p);        
              if(hmid < 0.0) {
                  tx = tmid;
                  hx = hmid;
              } else {
                  tm = tmid;
                  hm = hmid;
              }        
              if(abs(hmid) < EPSILON) break;
          }
          return mix(tm, tx, hm / (hm - hx));
      }

      vec3 getPixel(in vec2 coord, float time) {    
          vec2 uv = coord / iResolution.xy;
          uv = uv * 2.0 - 1.0;
          uv.x *= iResolution.x / iResolution.y;    
              
          vec3 ang = vec3(sin(time*3.0)*0.1,sin(time)*0.2+0.3,time);    
          vec3 ori = vec3(0.0,3.5,time*5.0);  
          vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.14;
          dir = normalize(dir) * fromEuler(ang);
          
          vec3 p;
          heightMapTracing(ori,dir,p);
          vec3 dist = p - ori;
          vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
          vec3 light = normalize(vec3(0.0,1.0,0.8)); 
                   
          return mix(
              getSkyColor(dir),
              getSeaColor(p,n,light,dir,dist),
              pow(smoothstep(0.0,-0.02,dir.y),0.2));
      }

      float ditherHash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      void main() {
          vec2 fragCoord = gl_FragCoord.xy;
          float time = iTime * 0.3 + iMouse.x * 0.001;
          vec3 color = getPixel(fragCoord, time);
          
          // Dithering to break up gradient banding
          float dither = ditherHash(fragCoord) - 0.5;
          color += dither / 255.0;
          
          gl_FragColor = vec4(pow(color,vec3(0.65)), 1.0);
      }
    `;

    const ripplesArray = Array(MAX_RIPPLES).fill(null).map(() => new THREE.Vector3(0, 0, -999));

    const oceanMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iResolution: { value: new THREE.Vector3(canvas.clientWidth, canvas.clientHeight, 1) },
        iTime: { value: 0 },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uRipples: { value: ripplesArray }
      },
      depthWrite: false,
    });

    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), oceanMaterial);
    bgScene.add(bgMesh);

    const birdScene = new THREE.Scene();
    const birdCamera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    birdCamera.position.set(0, 0, 10);

    const birdGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0, -1, 0.2, -0.5, 0, 0, -1.0,
      0, 0, 0, 1, 0.2, -0.5, 0, 0, -1.0,
    ]);
    birdGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Оптимизация процессора (CPU): Перенос анимации крыльев на GPU
    const birdMat = new THREE.ShaderMaterial({
      uniforms: { iTime: { value: 0 } },
      vertexShader: `
        uniform float iTime;
        void main() {
            vec3 pos = position;
            // Использование позиции объекта как уникального смещения для каждой птицы
            float offset = modelMatrix[3][0] * 0.5 + modelMatrix[3][2] * 0.5;
            // Машут только внешние вершины крыльев
            if (abs(pos.x) > 0.5) {
                pos.y += sin(iTime * 15.0 + offset) * 0.5;
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        void main() { gl_FragColor = vec4(1.0); }
      `,
      side: THREE.DoubleSide
    });

    const NUM_BIRDS = 15;
    const birds: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];

    for (let i = 0; i < NUM_BIRDS; i++) {
      const mesh = new THREE.Mesh(birdGeo, birdMat);
      mesh.position.set((Math.random() - 0.5) * 40, Math.random() * 5 + 2, (Math.random() - 0.5) * -30 - 10);
      mesh.scale.set(0.15, 0.15, 0.15);
      birds.push({ mesh, speed: 0.05 + Math.random() * 0.03, offset: Math.random() * Math.PI * 2 });
      birdScene.add(mesh);
    }

    let currentCanvasWidth = canvas.clientWidth;
    let currentCanvasHeight = canvas.clientHeight;
    let rippleIndex = 0;
    let lastRippleTime = 0;

    const spawnRipple = (clientX: number, clientY: number) => {
      const baseTime = clock.getElapsed();
      if (baseTime - lastRippleTime < 0.12) return;
      lastRippleTime = baseTime;

      const time = baseTime * 0.3 + oceanMaterial.uniforms.iMouse.value.x * 0.001;

      // Convert viewport coords to canvas-local CSS coords
      const rect = canvas.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      // Match shader UV exactly:
      //   gl_FragCoord = (localX * dpr, (cssH - localY) * dpr)
      //   iResolution  = (cssW, cssH)
      //   uv = fragCoord / iResolution = (localX/cssW * dpr, (cssH-localY)/cssH * dpr)
      //   uv = uv * 2.0 - 1.0
      //   uv.x *= iResolution.x / iResolution.y
      const currentDpr = renderer.getPixelRatio();
      let uvX = (localX / currentCanvasWidth * currentDpr) * 2.0 - 1.0;
      let uvY = ((currentCanvasHeight - localY) / currentCanvasHeight * currentDpr) * 2.0 - 1.0;
      uvX *= currentCanvasWidth / currentCanvasHeight;

      const angX = Math.sin(time * 3.0) * 0.1;
      const angY = Math.sin(time) * 0.2 + 0.3;
      const angZ = time;

      const a1x = Math.sin(angX), a1y = Math.cos(angX);
      const a2x = Math.sin(angY), a2y = Math.cos(angY);
      const a3x = Math.sin(angZ), a3y = Math.cos(angZ);

      const m0x = a1y * a3y + a1x * a2x * a3x, m0y = a1y * a2x * a3x + a3y * a1x, m0z = -a2y * a3x;
      const m1x = -a2y * a1x, m1y = a1y * a2y, m1z = a2x;
      const m2x = a3y * a1x * a2x + a1y * a3x, m2y = a1x * a3x - a1y * a3y * a2x, m2z = a2y * a3y;

      let dx = uvX, dy = uvY, dz = -2.0;
      let len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      dx /= len; dy /= len; dz /= len;

      let uvLen = Math.sqrt(uvX * uvX + uvY * uvY);
      dz += uvLen * 0.14;

      len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      dx /= len; dy /= len; dz /= len;

      const rx = dx * m0x + dy * m0y + dz * m0z;
      const ry = dx * m1x + dy * m1y + dz * m1z;
      const rz = dx * m2x + dy * m2y + dz * m2z;

      const ox = 0.0, oy = 3.5, oz = time * 5.0;

      if (ry >= 0) return;
      const t = -oy / ry;
      const hitX = ox + rx * t;
      const hitZ = oz + rz * t;

      ripplesArray[rippleIndex].set(hitX, hitZ, baseTime);
      rippleIndex = (rippleIndex + 1) % MAX_RIPPLES;
    };

    const handlePointerDown = (e: PointerEvent) => spawnRipple(e.clientX, e.clientY);
    const handlePointerMove = (e: PointerEvent) => {
      oceanMaterial.uniforms.iMouse.value.set(e.clientX * 0.5, (currentCanvasHeight - e.clientY) * 0.5, 0, 0);
      if (e.buttons > 0 || e.pointerType === "touch") spawnRipple(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let resizeObserver: ResizeObserver;
    const handleResize = () => {
      if (!canvas) return;
      currentCanvasWidth = canvas.clientWidth;
      currentCanvasHeight = canvas.clientHeight;
      renderer.setSize(currentCanvasWidth, currentCanvasHeight, false);
      oceanMaterial.uniforms.iResolution.value.set(currentCanvasWidth, currentCanvasHeight, 1);
      birdCamera.aspect = currentCanvasWidth / currentCanvasHeight;
      birdCamera.updateProjectionMatrix();
    };

    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    handleResize();

    let frameCount = 0;
    const animate = (timestamp?: number) => {
      animationId = requestAnimationFrame(animate);
      clock.update(timestamp);
      const elapsedTime = clock.getElapsed();

      oceanMaterial.uniforms.iTime.value = elapsedTime;
      birdMat.uniforms.iTime.value = elapsedTime; // Передаем время в шейдер птиц

      birds.forEach((bird) => {
        bird.mesh.position.z += bird.speed;
        bird.mesh.position.x += Math.sin(elapsedTime * 0.5 + bird.offset) * 0.02;

        if (bird.mesh.position.z > 5) {
          bird.mesh.position.z = -40;
          bird.mesh.position.x = (Math.random() - 0.5) * 40;
        }

        bird.mesh.rotation.z = Math.sin(elapsedTime * 2 + bird.offset) * 0.1;
      });

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(birdScene, birdCamera);

      if (!isLoaded) {
        frameCount++;
        if (frameCount === 3) setIsLoaded(true);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      renderer.dispose();
      oceanMaterial.dispose();
      birdGeo.dispose();
      birdMat.dispose();
    };
  }, []);

  return (
    <>
      <CuteFishPreloader fadeOut={isLoaded} />
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-auto cursor-pointer transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 6 }}
      />
    </>
  );
}