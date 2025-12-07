import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";
import "./ColorBends.css";

const MAX_COLORS = 8;

const frag = [
  "#define MAX_COLORS " + MAX_COLORS,
  "precision highp float;",
  "",
  "uniform vec2 uCanvas;",
  "uniform float uTime;",
  "uniform float uSpeed;",
  "uniform vec2 uRot;",
  "uniform int uColorCount;",
  "uniform vec3 uColors[MAX_COLORS];",
  "uniform int uTransparent;",
  "uniform float uScale;",
  "uniform float uFrequency;",
  "uniform float uWarpStrength;",
  "uniform vec2 uPointer;",
  "uniform float uMouseInfluence;",
  "uniform float uParallax;",
  "uniform float uNoise;",
  "uniform float uHueShift;",
  "varying vec2 vUv;",
  "",
  "// YIQ color space hue shifting (same as DarkVeil)",
  "mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);",
  "mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);",
  "",
  "vec3 hueShiftRGB(vec3 col,float deg){",
  "    vec3 yiq=rgb2yiq*col;",
  "    float rad=radians(deg);",
  "    float cosh=cos(rad),sinh=sin(rad);",
  "    vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);",
  "    return clamp(yiq2rgb*yiqShift,0.0,1.0);",
  "}",
  "",
  "void main() {",
  "  float t = uTime * uSpeed;",
  "  vec2 p = vUv * 2.0 - 1.0;",
  "  p += uPointer * uParallax * 0.1;",
  "  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);",
  "  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);",
  "  q /= max(uScale, 0.0001);",
  "  q /= 0.5 + 0.2 * dot(q, q);",
  "  q += 0.2 * cos(t) - 7.56;",
  "  vec2 toward = (uPointer - rp);",
  "  q += toward * uMouseInfluence * 0.2;",
  "",
  "  vec3 col = vec3(0.0);",
  "  float a = 1.0;",
  "",
  "  if (uColorCount > 0) {",
  "    vec2 s = q;",
  "    vec3 sumCol = vec3(0.0);",
  "    float cover = 0.0;",
  "    for (int i = 0; i < MAX_COLORS; ++i) {",
  "      if (i >= uColorCount) break;",
  "      s -= 0.01;",
  "      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));",
  "      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);",
  "      float kBelow = clamp(uWarpStrength, 0.0, 1.0);",
  "      float kMix = pow(kBelow, 0.3);",
  "      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);",
  "      vec2 disp = (r - s) * kBelow;",
  "      vec2 warped = s + disp * gain;",
  "      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);",
  "      float m = mix(m0, m1, kMix);",
  "      float w = 1.0 - exp(-6.0 / exp(6.0 * m));",
  "      sumCol += uColors[i] * w;",
  "      cover = max(cover, w);",
  "    }",
  "    col = clamp(sumCol, 0.0, 1.0);",
  "    a = uTransparent > 0 ? cover : 1.0;",
  "  } else {",
  "    vec2 s = q;",
  "    for (int k = 0; k < 3; ++k) {",
  "      s -= 0.01;",
  "      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));",
  "      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);",
  "      float kBelow = clamp(uWarpStrength, 0.0, 1.0);",
  "      float kMix = pow(kBelow, 0.3);",
  "      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);",
  "      vec2 disp = (r - s) * kBelow;",
  "      vec2 warped = s + disp * gain;",
  "      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);",
  "      float m = mix(m0, m1, kMix);",
  "      col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));",
  "    }",
  "    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;",
  "  }",
  "",
  "  if (uNoise > 0.0001) {",
  "    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);",
  "    col += (n - 0.5) * uNoise;",
  "    col = clamp(col, 0.0, 1.0);",
  "  }",
  "",
  "    vec3 rgb = (uTransparent > 0) ? col * a : col;",
  "    // Apply hue shift",
  "    rgb = hueShiftRGB(rgb, uHueShift);",
  "    gl_FragColor = vec4(rgb, a);",
  "}",
].join("\n");
const vert = [
  "varying vec2 vUv;",
  "void main() {",
  "  vUv = uv;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

export default function ColorBendsBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);
  const materialRef = useRef(null);
  const meshRef = useRef(null);
  const pointerTargetRef = useRef([0, 0]);
  const pointerCurrentRef = useRef([0, 0]);
  const mountedRef = useRef(true);
  const { theme } = useTheme();
  const { primaryColor } = theme || {};

  useEffect(() => {
    if (!canvasRef.current) return;
    mountedRef.current = true;

    function getHueShiftFromColor(color) {
      const COLOR_TO_HUE_SHIFT = {
        "oklch(63.7% .237 25.331)": 242,
        "oklch(70.5% .213 47.604)": 220,
        "oklch(76.9% .188 70.08)": 208,
        "oklch(79.5% .184 86.047)": 200,
        "oklch(76.8% .233 130.85)": 164,
        "oklch(72.3% .219 149.579)": 95,
        "oklch(69.6% .17 162.48)": 63,
        "oklch(70.4% .14 182.503)": 50,
        "oklch(71.5% .143 215.221)": 45,
        "oklch(68.5% .169 237.323)": 42,
        "oklch(62.3% .214 259.815)": 24,
        "oklch(58.5% .233 277.117)": 15,
        "oklch(60.6% .25 292.717)": 0,
        "oklch(62.7% .265 303.9)": 341,
        "oklch(66.7% .295 322.15)": 292,
        "oklch(65.6% .241 354.308)": 282,
        "oklch(64.5% .246 16.439)": 258,
      };
      if (COLOR_TO_HUE_SHIFT[color] !== undefined)
        return COLOR_TO_HUE_SHIFT[color];
      if (color && color.startsWith("oklch")) {
        const match = color.match(
          /oklch\(\s*[\d.]+%?\s+[\d.]+\s+([\d.]+)\s*\)/
        );
        if (match) {
          const hue = parseFloat(match[1]) || 0;
          return hue - 140;
        }
      }
      return 0;
    }

    const hexToRgb = (hex) => {
      const h = hex.replace("#", "").trim();
      const v =
        h.length === 3
          ? [
              parseInt(h[0] + h[0], 16),
              parseInt(h[1] + h[1], 16),
              parseInt(h[2] + h[2], 16),
            ]
          : [
              parseInt(h.slice(0, 2), 16),
              parseInt(h.slice(2, 4), 16),
              parseInt(h.slice(4, 6), 16),
            ];
      return [v[0] / 255, v[1] / 255, v[2] / 255];
    };

    const hueShift = getHueShiftFromColor(
      primaryColor || "oklch(63.7% .237 25.331)"
    );
    const rotation = 30;
    const speed = 0.3;
    const colors = ["#ff5c7a", "#8a5cff", "#00ffd1"];
    const transparent = true;
    const scale = 1.2;
    const frequency = 1.4;
    const warpStrength = 1.2;
    const mouseInfluence = 0.8;
    const parallax = 0.6;
    const noise = 0.08;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const arr = (colors || [])
      .filter(Boolean)
      .slice(0, MAX_COLORS)
      .map(hexToRgb);
    const uColorsArray = [];
    for (let i = 0; i < MAX_COLORS; i++) {
      if (i < arr.length) {
        const [r, g, b] = arr[i];
        uColorsArray.push(new THREE.Vector3(r, g, b));
      } else {
        uColorsArray.push(new THREE.Vector3(0, 0, 0));
      }
    }

    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      uniforms: {
        uCanvas: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRot: {
          value: new THREE.Vector2(
            Math.cos((rotation * Math.PI) / 180),
            Math.sin((rotation * Math.PI) / 180)
          ),
        },
        uColorCount: { value: arr.length },
        uColors: { value: uColorsArray },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uHueShift: { value: hueShift },
      },
    });

    materialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const t0 = performance.now();

    const handleResize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth));
      const h = Math.max(1, Math.floor(window.innerHeight));
      renderer.setSize(w, h);
      material.uniforms.uCanvas.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(document.body);

    rafRef.current = null;
    const loop = (t) => {
      if (!mountedRef.current) return;
      const elapsed = (t - t0) * 0.001;
      material.uniforms.uTime.value = elapsed;

      const cur = pointerCurrentRef.current;
      const tgt = pointerTargetRef.current;
      const amt = 0.1;
      cur[0] += (tgt[0] - cur[0]) * amt;
      cur[1] += (tgt[1] - cur[1]) * amt;
      material.uniforms.uPointer.value.set(cur[0], cur[1]);

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTargetRef.current = [x, y];
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      mountedRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      materialRef.current = null;
    };
  }, [primaryColor]);

  return <canvas ref={canvasRef} className="darkveil-canvas" />;
}
