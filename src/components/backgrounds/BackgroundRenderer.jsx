import { lazy, Suspense } from "react";
import DarkVeil from "./DarkVeil.jsx";

// Lazy load the new backgrounds for code splitting
const PlasmaBackground = lazy(() => import("./PlasmaBackground"));
const ColorBendsBackground = lazy(() => import("./ColorBendsBackground"));
const NoneBackground = lazy(() => import("./NoneBackground"));

const BackgroundRenderer = ({ backgroundType = "darkveil" }) => {
  // Fallback during lazy loading
  const LoadingFallback = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "var(--background)",
        zIndex: -1,
      }}
    />
  );

  // Render the selected background
  const renderBackground = () => {
    switch (backgroundType) {
      case "plasma":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PlasmaBackground />
          </Suspense>
        );
      case "colorbends":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ColorBendsBackground />
          </Suspense>
        );
      case "none":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <NoneBackground />
          </Suspense>
        );
      case "darkveil":
      default:
        return <DarkVeil />;
    }
  };

  return renderBackground();
};

export default BackgroundRenderer;
