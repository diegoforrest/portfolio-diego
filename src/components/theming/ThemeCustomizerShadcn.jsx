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

  // Prevent body scroll when customizer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    if (primaryColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        primaryColor
      );
    }
  }, [primaryColor]);

  return (
    <ThemeCustomizerUIContext.Provider value={{ isOpen: open }}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
        <PopoverContent
          align="end"
          className="w-[320px] p-0! border rounded-lg overflow-hidden flex flex-col max-h-[580px]"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--theme-card-bg)",
          }}
          sideOffset={8}
          onInteractOutside={() => setOpen(false)}
        >
          <div
            className="space-y-3! p-4! overflow-y-auto flex-1 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div>
              <h2
                className="text-s font-semibold"
                style={{
                  color: "var(--text-color-light)",
                }}
              >
                Colors
              </h2>
            </div>

            {/* Primary Color */}
            <div>
              <h3
                className="text-l font-semibold mb-2!"
                style={{
                  color: "var(--text-color)",
                }}
              >
                Primary Color
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
              <h3
                className="text-l font-semibold mb-2!"
                style={{
                  color: "var(--text-color)",
                }}
              >
                Surface Color
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

            {/* Divider */}
            <div
              className="h-px w-full mt-5!"
              style={{ backgroundColor: "var(--text-color-light)" }}
            />

            {/* Typography */}
            <div>
              <h2
                className="text-s font-semibold"
                style={{
                  color: "var(--text-color-light)",
                }}
              >
                Typography
              </h2>

              {/* Font Family */}
              <div className="mb-3! mt-3!">
                <h3
                  className="text-l font-semibold mb-2!"
                  style={{
                    color: "var(--text-color)",
                  }}
                >
                  Font family
                </h3>
                <div
                  className="inline-flex rounded-lg p-1 w-auto"
                  style={{ backgroundColor: "var(--theme-font-bg)" }}
                >
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      title={font.name}
                      className={cn(
                        "w-12 h-8 flex items-center justify-center px-2 py-1 text-xs font-bold transition-all rounded-sm",
                        fontFamily === font.value ? "shadow-sm" : ""
                      )}
                      style={{
                        backgroundColor:
                          fontFamily === font.value
                            ? "var(--primary-color)"
                            : "transparent",
                        color: "var(--text-color)",
                        fontFamily:
                          fontFamily === font.value ? font.value : undefined,
                      }}
                    >
                      Aa
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div className="relative">
                {/* Under Construction Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 backdrop-blur-[2px] rounded-lg cursor-not-allowed">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-black/20"
                    style={{
                      color: "var(--text-color-light)",
                    }}
                  >
                    Work in Progress
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3! mt-3!">
                  <h3
                    className="text-l font-semibold"
                    style={{
                      color: "var(--text-color)",
                    }}
                  >
                    Text size
                  </h3>
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
                  className="w-auto pointer-events-none"
                  style={{
                    "--slider-track-bg": "var(--primary-color)",
                    "--slider-thumb-ring": "var(--primary-color-light)",
                    "--slider-thumb-inner": "var(--background",
                  }}
                />
                {/* Preset labels under the slider */}
                <div className="mt-2! relative">
                  <div
                    className="flex text-[11px]"
                    style={{
                      color: "var(--text-color-light)",
                    }}
                  >
                    <span
                      className="absolute left-0"
                      style={{ transform: "translateX(0%)" }}
                    >
                      {TEXT_SIZES[0].name}
                    </span>
                    <span
                      className="absolute"
                      style={{ left: "33.33%", transform: "translateX(-50%)" }}
                    >
                      {TEXT_SIZES[1].name}
                    </span>
                    <span
                      className="absolute"
                      style={{ left: "66.66%", transform: "translateX(-50%)" }}
                    >
                      {TEXT_SIZES[2].name}
                    </span>
                    <span
                      className="absolute right-0"
                      style={{ transform: "translateX(0%)" }}
                    >
                      {TEXT_SIZES[3].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="h-px w-full mt-8!"
              style={{ backgroundColor: "var(--text-color-light)" }}
            />

            {/* Wallpaper */}
            <div>
              <h3
                className="text-s font-semibold mb-3!"
                style={{
                  color: "var(--text-color-light)",
                }}
              >
                Wallpaper
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setBackgroundType(bg.value)}
                    className={cn(
                      "relative h-12 rounded-lg overflow-hidden transition-all hover:scale-105 mb-1!",
                      bg.preview ? "bg-cover bg-center" : "",
                      backgroundType === bg.value && "ring-2 ring-white/80"
                    )}
                    style={
                      bg.preview
                        ? { backgroundImage: `url(${bg.preview})` }
                        : { backgroundColor: "var(--theme-font-bg)" }
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
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--text-color)" }}
                        >
                          None
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions - Sticky Bottom */}
          <div
            className="sticky bottom-0 pt-3! px-4! pb-4! rounded-b-lg"
            style={{
              borderTop: "1px solid var(--text-color-light)",
              backgroundColor: "var(--theme-card-nav-bg)",
            }}
          >
            <h3
              className="text-s font-semibold mb-2!"
              style={{
                color: "var(--text-color-light)",
              }}
            >
              Actions
            </h3>
            <div className="flex gap-2 justify-start">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-8 disabled:opacity-30 transition-all active:scale-[0.8]"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border-alt)",
                  color: "var(--text-color)",
                }}
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4 mr-1.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-8 disabled:opacity-30 transition-all active:scale-[0.9]"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border-alt)",
                  color: "var(--text-color)",
                }}
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4 mr-1.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-8 transition-all active:scale-[0.9]"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border-alt)",
                  color: "var(--text-color)",
                }}
                onClick={resetTheme}
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </ThemeCustomizerUIContext.Provider>
  );
}

export default ThemeCustomizer;
