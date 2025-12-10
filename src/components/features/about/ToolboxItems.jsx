import { useState } from "react";
import { Icon } from "../../common";

const ItemSet = ({ items, vertical, column }) => (
  <div className="toolbox-item-set">
    {items.map((it, i) => {
      const IconType = it.iconType;
      return (
        <div
          className={`toolbox-item ${vertical ? "toolbox-item-vertical" : ""} ${
            column ? `toolbox-item-${column}` : ""
          }`}
          key={i}
        >
          {typeof IconType === "function" ? (
            <IconType />
          ) : typeof IconType === "string" ? (
            <Icon name={IconType} className="toolbox-svg" />
          ) : (
            <span style={{ width: 14, height: 14, display: "inline-block" }} />
          )}
          <span style={{ marginLeft: 6 }}>{it.title}</span>
        </div>
      );
    })}
  </div>
);

export const ToolboxItems = ({
  items = [],
  itemsWraperClassName = "",
  className = "",
  animationDuration,
  vertical = false,
  column = "",
}) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={`toolbox-viewport ${
        vertical ? "toolbox-viewport-vertical" : ""
      } ${className || ""}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`toolbox-track ${vertical ? "toolbox-track-vertical" : ""} ${
          itemsWraperClassName || ""
        }`}
        style={{
          animationDuration: animationDuration || undefined,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        aria-hidden="true"
      >
        <ItemSet items={items} vertical={vertical} column={column} />
        <ItemSet items={items} vertical={vertical} column={column} />
      </div>
    </div>
  );
};
