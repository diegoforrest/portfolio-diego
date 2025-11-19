// Simple icon loader component for custom SVG icons
export const Icon = ({ name, className, style }) => {
  return (
    <img 
      src={`/icons/${name}.svg`} 
      alt={name}
      className={className}
      style={style}
    />
  );
};
