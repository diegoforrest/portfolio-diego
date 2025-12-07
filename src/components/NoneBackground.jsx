const NoneBackground = () => {
  return (
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
};

export default NoneBackground;
