import { useState, createContext, useContext } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { useThemeCustomizer } from './ThemeCustomizerProvider';

// Context for controlling the drawer from other components
const ThemeCustomizerUIContext = createContext(null);

export const useThemeCustomizerUI = () => {
  const context = useContext(ThemeCustomizerUIContext);
  if (!context) {
    throw new Error('useThemeCustomizerUI must be used within ThemeCustomizer');
  }
  return context;
};

const PRIMARY_COLORS = [
  '#f44336', '#e91e63', '#ff5722', '#ff9800', '#ffc107',
  '#8bc34a', '#4caf50', '#00bcd4', '#03a9f4', '#2196f3',
  '#3f51b5', '#673ab7', '#9c27b0', '#e040fb', '#00e5ff',
];

const SURFACE_COLORS = [
  { name: 'Gold', value: '#8b7355', bg: '#1a1a1a' },
  { name: 'Light', value: '#f5f5f5', bg: '#ffffff' },
  { name: 'Gray', value: '#9e9e9e', bg: '#2a2a2a' },
  { name: 'Dark', value: '#424242', bg: '#121212' },
  { name: 'Charcoal', value: '#616161', bg: '#1e1e1e' },
];

const FONT_FAMILIES = [
  { label: 'Aa', value: 'Inter, sans-serif', style: 'normal' },
  { label: 'Aa', value: 'Georgia, serif', style: 'italic' },
  { label: 'Aa', value: 'monospace', style: 'normal' },
];

const TEXT_SIZES = [
  { label: 'Compact', value: 0.85 },
  { label: 'Normal', value: 1 },
  { label: 'Comfortable', value: 1.1 },
  { label: 'Large', value: 1.25 },
];

const WALLPAPERS = [
  { name: 'Aurora', value: 'aurora', preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'sunset', preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Dark Veil', value: 'darkveil', preview: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)' },
  { name: 'None', value: 'none', preview: 'transparent' },
];

function ThemeCustomizerDrawer({ open, onClose }) {
  const { 
    primaryColor, 
    setPrimaryColor, 
    surfaceColor, 
    setSurfaceColor,
    fontFamily,
    setFontFamily,
    textSize,
    setTextSize,
    wallpaper,
    setWallpaper,
    resetTheme,
    undo,
    redo,
    canUndo,
    canRedo
  } = useThemeCustomizer();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          bgcolor: '#1a1a2e',
          color: 'white',
          p: 3,
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }
      }}
    >
      {/* Colors Section */}
      <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
        Colors
      </Typography>
      
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Primary color
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {PRIMARY_COLORS.map((color) => (
          <Tooltip key={color} title={color} arrow>
            <Box
              onClick={() => setPrimaryColor(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: primaryColor === color ? '2px solid white' : '2px solid transparent',
                transition: 'transform 0.2s, border 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {primaryColor === color && <CheckIcon sx={{ fontSize: 16, color: 'white' }} />}
            </Box>
          </Tooltip>
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Surface color
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {SURFACE_COLORS.map((surface) => (
          <Tooltip key={surface.name} title={surface.name} arrow>
            <Box
              onClick={() => setSurfaceColor(surface)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: surface.value,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: surfaceColor?.name === surface.name ? '2px solid white' : '2px solid transparent',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              {surfaceColor?.name === surface.name && <CheckIcon sx={{ fontSize: 18 }} />}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Typography Section */}
      <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
        Typography
      </Typography>
      
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Font family
      </Typography>
      <ToggleButtonGroup
        value={fontFamily}
        exclusive
        onChange={(e, val) => val && setFontFamily(val)}
        sx={{ mb: 3 }}
      >
        {FONT_FAMILIES.map((font, idx) => (
          <ToggleButton 
            key={idx} 
            value={font.value}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.2)',
              fontFamily: font.value,
              fontStyle: font.style,
              '&.Mui-selected': {
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
              }
            }}
          >
            {font.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        Text size
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Aa</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 'auto' }}>
          Normal ({textSize}x)
        </Typography>
      </Box>
      <Slider
        value={textSize}
        onChange={(e, val) => setTextSize(val)}
        min={0.85}
        max={1.25}
        step={0.05}
        sx={{
          color: primaryColor,
          '& .MuiSlider-thumb': {
            bgcolor: 'white',
          }
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {TEXT_SIZES.map((size) => (
          <Typography 
            key={size.label}
            variant="caption" 
            onClick={() => setTextSize(size.value)}
            sx={{ 
              color: textSize === size.value ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              '&:hover': { color: 'white' }
            }}
          >
            {size.label}
          </Typography>
        ))}
      </Box>

      {/* Wallpaper Section */}
      <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        Wallpaper
        <Typography component="span" variant="caption" sx={{ 
          bgcolor: 'rgba(255,255,255,0.1)', 
          px: 1, 
          py: 0.25, 
          borderRadius: 1,
          fontSize: '0.65rem'
        }}>
          Work in Progress
        </Typography>
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
        {WALLPAPERS.map((wp) => (
          <Tooltip key={wp.value} title={wp.name} arrow>
            <Box
              onClick={() => setWallpaper(wp.value)}
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: wp.preview,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: wallpaper === wp.value ? '2px solid #00e5ff' : '2px solid transparent',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              {wallpaper === wp.value && <CheckIcon sx={{ color: 'white' }} />}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Actions Section */}
      <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5 }}>
        Actions
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          onClick={undo} 
          disabled={!canUndo}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.1)', 
            color: 'white',
            '&:disabled': { color: 'rgba(255,255,255,0.3)' }
          }}
        >
          <UndoIcon />
        </IconButton>
        <IconButton 
          onClick={redo} 
          disabled={!canRedo}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.1)', 
            color: 'white',
            '&:disabled': { color: 'rgba(255,255,255,0.3)' }
          }}
        >
          <RedoIcon />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={resetTheme}
          sx={{
            ml: 'auto',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Reset
        </Button>
      </Box>
    </Drawer>
  );
}

export function ThemeCustomizer({ children }) {
  const [open, setOpen] = useState(false);

  const openCustomizer = () => setOpen(true);
  const closeCustomizer = () => setOpen(false);

  return (
    <ThemeCustomizerUIContext.Provider value={{ openCustomizer, closeCustomizer, isOpen: open }}>
      {children}
      <ThemeCustomizerDrawer open={open} onClose={closeCustomizer} />
    </ThemeCustomizerUIContext.Provider>
  );
}

export default ThemeCustomizer;
