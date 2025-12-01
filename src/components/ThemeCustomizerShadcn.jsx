import { useState, createContext, useContext } from 'react';
import { Settings2, Undo2, Redo2, RotateCcw, Check, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ui/theme-provider';
import { useThemeCustomizer } from './ThemeCustomizerProvider';
import { cn } from '@/lib/utils';

// Context for controlling the dropdown from other components
const ThemeCustomizerUIContext = createContext(null);

export const useThemeCustomizerUI = () => {
  const context = useContext(ThemeCustomizerUIContext);
  if (!context) {
    throw new Error('useThemeCustomizerUI must be used within ThemeCustomizer');
  }
  return context;
};

// atom63-inspired color palette using oklch
const PRIMARY_COLORS = [
  // Row 1 - Warm colors
  { name: 'Red', value: 'oklch(63.7% .237 25.331)' },
  { name: 'Orange', value: 'oklch(70.5% .213 47.604)' },
  { name: 'Amber', value: 'oklch(76.9% .188 70.08)' },
  { name: 'Yellow', value: 'oklch(79.5% .184 86.047)' },
  { name: 'Lime', value: 'oklch(76.8% .233 130.85)' },
  { name: 'Green', value: 'oklch(72.3% .219 149.579)' },
  { name: 'Emerald', value: 'oklch(69.6% .17 162.48)' },
  // Row 2 - Cool colors  
  { name: 'Teal', value: 'oklch(70.4% .14 182.503)' },
  { name: 'Cyan', value: 'oklch(71.5% .143 215.221)' },
  { name: 'Sky', value: 'oklch(68.5% .169 237.323)' },
  { name: 'Blue', value: 'oklch(62.3% .214 259.815)' },
  { name: 'Indigo', value: 'oklch(58.5% .233 277.117)' },
  { name: 'Violet', value: 'oklch(60.6% .25 292.717)' },
  { name: 'Purple', value: 'oklch(62.7% .265 303.9)' },
  // Row 3 - Pink/Rose
  { name: 'Fuchsia', value: 'oklch(66.7% .295 322.15)' },
  { name: 'Pink', value: 'oklch(65.6% .241 354.308)' },
  { name: 'Rose', value: 'oklch(64.5% .246 16.439)' },
];

// Font options - Inter as default, Geist as alternative
const FONT_OPTIONS = [
  { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
  { name: 'Geist', value: '"Geist", system-ui, sans-serif' },
  { name: 'System', value: 'system-ui, sans-serif' },
  { name: 'Serif', value: '"Georgia", serif' },
  { name: 'Mono', value: '"JetBrains Mono", monospace' },
];

const TEXT_SIZES = [
  { name: 'Compact', value: '0.875' },
  { name: 'Normal', value: '1' },
  { name: 'Comfortable', value: '1.125' },
  { name: 'Large', value: '1.25' },
];

export function ThemeCustomizer({ children }) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { 
    primaryColor, 
    setPrimaryColor,
    fontFamily,
    setFontFamily,
    textSize,
    setTextSize,
    resetTheme,
    undo,
    redo,
    canUndo,
    canRedo
  } = useThemeCustomizer();

  const openCustomizer = () => setOpen(true);
  const closeCustomizer = () => setOpen(false);

  return (
    <ThemeCustomizerUIContext.Provider value={{ openCustomizer, closeCustomizer, isOpen: open }}>
      {children}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <span className="hidden" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-72 bg-zinc-900 border-zinc-800 text-white"
          sideOffset={5}
        >
          {/* Theme Mode */}
          <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-wider">
            Appearance
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 text-zinc-100 focus:bg-zinc-800 focus:text-white">
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              <span>Theme</span>
              <span className="ml-auto text-xs text-zinc-500 capitalize">{theme}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light" className="text-zinc-100 focus:bg-zinc-800 focus:text-white">
                  <Sun className="h-4 w-4 mr-2" /> Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="text-zinc-100 focus:bg-zinc-800 focus:text-white">
                  <Moon className="h-4 w-4 mr-2" /> Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="text-zinc-100 focus:bg-zinc-800 focus:text-white">
                  <Monitor className="h-4 w-4 mr-2" /> System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-zinc-800" />

          {/* Primary Color */}
          <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-wider">
            Primary Color
          </DropdownMenuLabel>
          <div className="px-2 py-2 flex flex-wrap gap-1.5">
            {PRIMARY_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setPrimaryColor(color.value)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all hover:scale-110 flex items-center justify-center",
                  primaryColor === color.value && "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {primaryColor === color.value && <Check className="h-3 w-3 text-white" />}
              </button>
            ))}
          </div>

          <DropdownMenuSeparator className="bg-zinc-800" />

          {/* Typography */}
          <DropdownMenuLabel className="text-xs text-zinc-500 uppercase tracking-wider">
            Typography
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-zinc-100 focus:bg-zinc-800 focus:text-white">
              <span>Font Family</span>
              <span className="ml-auto text-xs text-zinc-500">
                {FONT_OPTIONS.find(f => f.value === fontFamily)?.name || 'Sans Serif'}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuRadioGroup value={fontFamily} onValueChange={setFontFamily}>
                {FONT_OPTIONS.map((font) => (
                  <DropdownMenuRadioItem 
                    key={font.value} 
                    value={font.value}
                    className="text-zinc-100 focus:bg-zinc-800 focus:text-white"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-zinc-100 focus:bg-zinc-800 focus:text-white">
              <span>Text Size</span>
              <span className="ml-auto text-xs text-zinc-500">
                {TEXT_SIZES.find(s => s.value === String(textSize))?.name || 'Normal'}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuRadioGroup value={String(textSize)} onValueChange={(v) => setTextSize(parseFloat(v))}>
                {TEXT_SIZES.map((size) => (
                  <DropdownMenuRadioItem 
                    key={size.value} 
                    value={size.value}
                    className="text-zinc-100 focus:bg-zinc-800 focus:text-white"
                  >
                    {size.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-zinc-800" />

          {/* Actions */}
          <div className="px-2 py-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={resetTheme}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeCustomizerUIContext.Provider>
  );
}

export default ThemeCustomizer;
