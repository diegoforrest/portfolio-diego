import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useThemeCustomizer } from "../theming/ThemeCustomizerProvider";
import "./Plasma.css";

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

function getHueShiftFromColor(color) {
  if (COLOR_TO_HUE_SHIFT[color] !== undefined) {
    return COLOR_TO_HUE_SHIFT[color];
  }
  if (color && color.startsWith("oklch")) {
    const match = color.match(/oklch\(\s*[\d.]+%?\s+[\d.]+\s+([\d.]+)\s*\)/);
    if (match) {
      const hue = parseFloat(match[1]) || 0;
      return hue - 140;
    }
  }
  return 0;
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const oklchToHex = (oklch) => {
  const match = oklch?.match(/oklch\(([^)]+)\)/);
  if (!match) return "#ff6b35";

  const parts = match[1].trim().split(/\s+/);
  const L = parseFloat(parts[0]) / 100; // Lightness 0-1
  const C = parseFloat(parts[1]) || 0; // Chroma
  const H = parseFloat(parts[2]) || 0; // Hue in degrees

  // Convert OKLCH to OKLAB
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Convert OKLAB to linear RGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Apply gamma correction (sRGB)
  const toSRGB = (val) => {
    val = Math.max(0, Math.min(1, val));
    return val <= 0.0031308
      ? 12.92 * val
      : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };

  r = Math.round(toSRGB(r) * 255);
  g = Math.round(toSRGB(g) * 255);
  bVal = Math.round(toSRGB(bVal) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`;
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  // Apply monochromatic color based on primary color
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 finalColor = intensity * uCustomColor;
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export default function PlasmaBackground() {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { primaryColor } = useThemeCustomizer();

  useEffect(() => {
    if (!containerRef.current) return;
    const containerEl = containerRef.current;

    const color = oklchToHex(primaryColor || "oklch(63.7% .237 25.331)");
    console.log("🎨 Plasma primaryColor:", primaryColor, "→ hex:", color);

    const speed = 1;
    const direction = "forward";
    const scale = 1;
    const opacity = 1;
    const mouseInteractive = false;

    const customColorRgb = hexToRgb(color);
    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e) => {
      if (!mouseInteractive) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerEl.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerEl);
    setSize();

    let raf = 0;
    const t0 = performance.now();
    const loop = (t) => {
      let timeValue = (t - t0) * 0.001;
      if (direction === "pingpong") {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward
          ? smooth * pingpongDuration
          : (1 - smooth) * pingpongDuration;
        program.uniforms.uDirection.value = 1.0;
        program.uniforms.iTime.value = pingpongTime;
      } else {
        program.uniforms.iTime.value = timeValue;
      }
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive && containerEl) {
        containerEl.removeEventListener("mousemove", handleMouseMove);
      }
      try {
        containerEl?.removeChild(canvas);
      } catch {
        console.warn("Canvas already removed from container");
      }
    };
  }, [primaryColor]);

  return <div ref={containerRef} className="plasma-container" />;
}
