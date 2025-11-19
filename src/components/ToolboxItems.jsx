import React from 'react';
import { Icon } from './Icon';

export const ToolboxItems = ({ items = [], itemsWraperClassName = '', className = '', animationDuration }) => {
  const renderedItems = [...items, ...items];

  return (
    <div className={`toolbox-viewport ${className || ''}`}>
      <div
        className={`toolbox-track ${itemsWraperClassName || ''}`}
        style={{ animationDuration: animationDuration || undefined }}
        aria-hidden="true"
      >
        {renderedItems.map((it, i) => {
          const IconType = it.iconType;
          return (
            <div className="toolbox-item" key={i}>
              {typeof IconType === 'function' ? (
                <IconType />
              ) : typeof IconType === 'string' ? (
                <Icon name={IconType} className="toolbox-svg" />
              ) : (
                <span style={{ width: 14, height: 14, display: 'inline-block' }} />
              )}
              <span style={{ marginLeft: 6 }}>{it.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
