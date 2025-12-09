import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full"
      style={{
        backgroundColor: "var(--slider-track-bg, var(--color-surface-500))",
      }}
    >
      <SliderPrimitive.Range
        className="absolute h-full"
        style={{
          backgroundColor: "var(--slider-track-bg, var(--color-surface-500))",
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      style={{
        backgroundColor: "var(--slider-thumb-inner, var(--background)",
        border: "2px solid var(--slider-thumb-ring, var(--primary-color))",
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
