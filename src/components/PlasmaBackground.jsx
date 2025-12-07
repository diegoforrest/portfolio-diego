import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Transform } from "ogl";
import { useTheme } from "./ThemeProvider";
import "./DarkVeil.css";

// Exact hue shift values calibrated by user testing (from DarkVeil)
const COLOR_TO_HUE_SHIFT = {
  "oklch(63.7% .237 25.331)": 242, // Red
  "oklch(70.5% .213 47.604)": 220, // Orange
  "oklch(76.9% .188 70.08)": 208, // Amber
  "oklch(79.5% .184 86.047)": 200, // Yellow
  "oklch(76.8% .233 130.85)": 164, // Lime
  "oklch(72.3% .219 149.579)": 95, // Green
  "oklch(69.6% .17 162.48)": 63, // Emerald
  "oklch(70.4% .14 182.503)": 50, // Teal
  "oklch(71.5% .143 215.221)": 45, // Cyan
  "oklch(68.5% .169 237.323)": 42, // Sky
  "oklch(62.3% .214 259.815)": 24, // Blue
  "oklch(58.5% .233 277.117)": 15, // Indigo
  "oklch(60.6% .25 292.717)": 0, // Violet
  "oklch(62.7% .265 303.9)": 341, // Purple
  "oklch(66.7% .295 322.15)": 292, // Fuchsia
  "oklch(65.6% .241 354.308)": 282, // Pink
  "oklch(64.5% .246 16.439)": 258, // Rose
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

// Convert OKLCH to approximate hex
const oklchToHex = (oklch) => {
  const match = oklch?.match(/oklch\(([^)]+)\)/);
  if (!match) return "#ff6b35";

  const parts = match[1].trim().split(/\s+/);
  const hue = parseFloat(parts[2]) || 0;

  const h = hue / 60;
  const c = 1;
  const x = c * (1 - Math.abs((h % 2) - 1));

  let r, g, b;
  if (h >= 0 && h < 1) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 1 && h < 2) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 2 && h < 3) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 3 && h < 4) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 4 && h < 5) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uHueShift;
in vec2 vUv;
out vec4 fragColor;

// YIQ color space hue shifting (same as DarkVeil)
mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);
mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);

vec3 hueShiftRGB(vec3 col,float deg){
    vec3 yiq=rgb2yiq*col;
    float rad=radians(deg);
    float cosh=cos(rad),sinh=sin(rad);
    vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);
    return clamp(yiq2rgb*yiqShift,0.0,1.0);
}

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
    Q = p.xz * mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(dot(Q,Q)) - .25*(5.+S.y))/3.+8e-4; 
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
  vec2 fragCoord = vUv * iResolution.xy;
  mainImage(o, fragCoord);
  vec3 rgb = sanitize(o.rgb);
  
  // Apply hue shift
  rgb = hueShiftRGB(rgb, uHueShift);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export const PlasmaBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const rafRef = useRef(null);
  const mountedRef = useRef(true);
  const meshRef = useRef(null);
  const { theme } = useTheme();
  const { primaryColor } = theme || {};

  useEffect(() => {
    if (!canvasRef.current) return;
    mountedRef.current = true;

    const hueShift = getHueShiftFromColor(
      primaryColor || "oklch(63.7% .237 25.331)"
    );
    const color = oklchToHex(primaryColor || "oklch(63.7% .237 25.331)");
    const useCustomColor = 0.0; // Use hue shifting instead of custom color
    const customColorRgb = hexToRgb(color);
    const speed = 1;
    const direction = "forward";
    const scale = 1;
    const opacity = 1;
    const mouseInteractive = true;

    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      alpha: true,
      webgl: 2,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [window.innerWidth, window.innerHeight] },
        uCustomColor: { value: customColorRgb },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: [0, 0] },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
        uHueShift: { value: hueShift },
      },
      transparent: true,
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;
    const scene = new Transform();
    scene.addChild(mesh);

    gl.clearColor(0, 0, 0, 0);

    const handleMouseMove = (e) => {
      if (!mouseInteractive) return;
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      program.uniforms.uMouse.value = [mousePos.current.x, mousePos.current.y];
    };

    if (mouseInteractive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const width = Math.max(1, Math.floor(window.innerWidth));
      const height = Math.max(1, Math.floor(window.innerHeight));
      renderer.setSize(width, height);
      program.uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(document.body);
    setSize();

    rafRef.current = null;
    const t0 = performance.now();
    const loop = (t) => {
      if (!mountedRef.current) return;
      const r = rendererRef.current;
      const p = programRef.current;
      if (!r || !p) return;
      let timeValue = (t - t0) * 0.001;
      p.uniforms.iTime.value = timeValue;
      r.gl.clear(r.gl.COLOR_BUFFER_BIT);
      if (typeof r.render === "function") {
        try {
          r.render({ scene });
        } catch (e) {
          console.warn("Renderer.render failed, falling back to mesh.draw", e);
          const m = meshRef.current;
          if (m && typeof m.draw === "function") {
            m.draw({ program: programRef.current });
          }
        }
      } else {
        const m = meshRef.current;
        if (m && typeof m.draw === "function") {
          m.draw({ program: programRef.current });
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (mouseInteractive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      // dispose program and renderer safely
      try {
        programRef.current?.remove?.();
      } catch (e) {}
      rendererRef.current?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      rendererRef.current = null;
      programRef.current = null;
    };
  }, [primaryColor]);

  return <canvas ref={canvasRef} className="darkveil-canvas" />;
};

export default PlasmaBackground;
