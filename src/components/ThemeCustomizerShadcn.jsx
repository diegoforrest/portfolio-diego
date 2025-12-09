import { useState, useEffect, createContext, useContext } from "react";
import { Undo2, Redo2, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useThemeCustomizer } from "./ThemeCustomizerProvider";
import { cn } from "@/lib/utils";

// Context for controlling the dropdown from other components
const ThemeCustomizerUIContext = createContext(null);

export const useThemeCustomizerUI = () => {
  const context = useContext(ThemeCustomizerUIContext);
  if (!context) {
    throw new Error("useThemeCustomizerUI must be used within ThemeCustomizer");
  }
  return context;
};

export const ThemeCustomizerTrigger = PopoverTrigger;

const PRIMARY_COLORS = [
  // Row 1 - Warm colors
  { name: "Red", value: "oklch(63.7% .237 25.331)" },
  { name: "Orange", value: "oklch(70.5% .213 47.604)" },
  { name: "Amber", value: "oklch(76.9% .188 70.08)" },
  { name: "Yellow", value: "oklch(79.5% .184 86.047)" },
  { name: "Lime", value: "oklch(76.8% .233 130.85)" },
  { name: "Green", value: "oklch(72.3% .219 149.579)" },
  { name: "Emerald", value: "oklch(69.6% .17 162.48)" },
  // Row 2 - Cool colors
  { name: "Teal", value: "oklch(70.4% .14 182.503)" },
  { name: "Cyan", value: "oklch(71.5% .143 215.221)" },
  { name: "Sky", value: "oklch(68.5% .169 237.323)" },
  { name: "Blue", value: "oklch(62.3% .214 259.815)" },
  { name: "Indigo", value: "oklch(58.5% .233 277.117)" },
  { name: "Violet", value: "oklch(60.6% .25 292.717)" },
  { name: "Purple", value: "oklch(62.7% .265 303.9)" },
  // Row 3 - Pink/Rose
  { name: "Fuchsia", value: "oklch(66.7% .295 322.15)" },
  { name: "Pink", value: "oklch(65.6% .241 354.308)" },
  { name: "Rose", value: "oklch(64.5% .246 16.439)" },
];

const SURFACE_COLORS = [
  { name: "Slate", value: "oklch(54.61% 0.022 252.89)", preview: "#64748b" },
  { name: "Gray", value: "oklch(55.01% 0.011 258.34)", preview: "#6b7280" },
  { name: "Zinc", value: "oklch(55.51% 0.016 256.85)", preview: "#71717a" },
  { name: "Neutral", value: "oklch(55.46% 0.007 77.65)", preview: "#737373" },
  { name: "Stone", value: "oklch(54.77% 0.012 56.35)", preview: "#78716c" },
];

const FONT_OPTIONS = [
  { name: "Inter", value: '"Inter", system-ui, sans-serif' },
  { name: "Geist", value: '"Geist", system-ui, sans-serif' },
  { name: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
];

const TEXT_SIZES = [
  { name: "Compact", value: "0.875" },
  { name: "Normal", value: "1" },
  { name: "Comfortable", value: "1.125" },
  { name: "Large", value: "1.25" },
];

// Background options
const BACKGROUND_OPTIONS = [
  { name: "Dark Veil", value: "darkveil", preview: "/images/darkveil.png" },
  { name: "Plasma", value: "plasma", preview: "/images/plasma.png" },
  {
    name: "Color Bends",
    value: "colorbends",
    preview: "/images/colorblend.png",
  },
  { name: "None", value: "none", preview: null },
];

export function ThemeCustomizer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    primaryColor,
    setPrimaryColor,
    surfaceColor,
    setSurfaceColor,
    fontFamily,
    setFontFamily,
    textSize,
    setTextSize,
    backgroundType,
    setBackgroundType,
    resetTheme,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useThemeCustomizer();

  const openCustomizer = () => setOpen(true);
  const closeCustomizer = () => setOpen(false);

  useEffect(() => {
    if (primaryColor) {
      try {
        document.documentElement.style.setProperty(
          "--primary-color",
          primaryColor
        );
      } catch (e) {
        // ignore if invalid color value
      }
    }
  }, [primaryColor]);

  return (
    <ThemeCustomizerUIContext.Provider
      value={{ openCustomizer, closeCustomizer, isOpen: open }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
        <PopoverContent
          align="end"
          className="w-[320px] p-4! bg-[#2c3240] border border-[#3a404f] text-white rounded-lg"
          sideOffset={8}
        >
          <div className="space-y-5!">
            <div>
              <h2
                className="text-sm font-semibold"
                style={{
                  color: "var(--text-color-light, rgba(255,255,255,0.9))",
                }}
              >
                Colors
              </h2>
            </div>

            {/* Primary Color */}
            <div>
              <h3 className="text-[11px] font-normal text-white/50 mb-2">
                Primary color
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRIMARY_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setPrimaryColor(color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all hover:scale-105 flex items-center justify-center",
                      primaryColor === color.value &&
                        "ring-2 ring-white/80 ring-offset-2 ring-offset-[#2c3240]"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {primaryColor === color.value && (
                      <Check
                        className="h-4 w-4 text-white drop-shadow-lg"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Color */}
            <div>
              <h3 className="text-[11px] font-normal text-white/50 mb-2">
                Surface color
              </h3>
              <div className="flex gap-2">
                {SURFACE_COLORS.map((surface) => (
                  <button
                    key={surface.value}
                    onClick={() => setSurfaceColor(surface.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all hover:scale-105 flex items-center justify-center border border-white/10",
                      surfaceColor === surface.value &&
                        "ring-2 ring-white/80 ring-offset-2 ring-offset-[#2c3240]"
                    )}
                    style={{ backgroundColor: surface.preview }}
                    title={surface.name}
                  >
                    {surfaceColor === surface.value && (
                      <Check
                        className="h-4 w-4 text-white drop-shadow-lg"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h2 className="text-sm font-medium text-white/90 mb-3">
                Typography
              </h2>

              {/* Font Family */}
              <div className="mb-3">
                <h3 className="text-[11px] font-normal text-white/50 mb-2">
                  Font family
                </h3>
                <div className="inline-flex rounded-lg bg-[#1f2430] p-1 w-full">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      className={cn(
                        "flex-1 px-4 py-1.5 text-sm font-medium transition-all rounded-md",
                        fontFamily === font.value
                          ? "bg-[#3a404f] text-white shadow-sm"
                          : "text-white/50 hover:text-white/70"
                      )}
                      style={
                        fontFamily === font.value
                          ? { fontFamily: font.value }
                          : {}
                      }
                    >
                      Aa
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-normal text-white/50">
                    Text size
                  </h3>
                  <span className="text-[11px] text-white/40">
                    {TEXT_SIZES.find((s) => s.value === String(textSize))
                      ?.name || "Normal"}
                  </span>
                </div>
                <Slider
                  value={[
                    TEXT_SIZES.findIndex((s) => s.value === String(textSize)),
                  ]}
                  onValueChange={(value) =>
                    setTextSize(parseFloat(TEXT_SIZES[value[0]].value))
                  }
                  max={TEXT_SIZES.length - 1}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-white/20 [&_.bg-primary]:bg-white/30"
                />
              </div>
            </div>

            {/* Wallpaper */}
            <div>
              <h3 className="text-[11px] font-normal text-white/50 mb-2">
                Wallpaper
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setBackgroundType(bg.value)}
                    className={cn(
                      "relative h-16 rounded-lg overflow-hidden transition-all hover:scale-105",
                      bg.preview
                        ? "bg-cover bg-center"
                        : "bg-[#1f2430] border border-white/10",
                      backgroundType === bg.value && "ring-2 ring-white/80"
                    )}
                    style={
                      bg.preview
                        ? { backgroundImage: `url(${bg.preview})` }
                        : {}
                    }
                    title={bg.name}
                  >
                    {backgroundType === bg.value && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check
                          className="h-5 w-5 text-white drop-shadow-lg"
                          strokeWidth={3}
                        />
                      </div>
                    )}
                    {bg.value === "none" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] text-white/50">None</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-[11px] font-normal text-white/50 mb-2">
                Actions
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20 disabled:opacity-30"
                  onClick={undo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-3.5 w-3.5 mr-1.5" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20 disabled:opacity-30"
                  onClick={redo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-3.5 w-3.5 mr-1.5" />
                  Redo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9 bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/20"
                  onClick={resetTheme}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </ThemeCustomizerUIContext.Provider>
  );
}

export default ThemeCustomizer;
