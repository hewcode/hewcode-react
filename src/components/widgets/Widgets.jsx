import React from 'react';
import Widget from './Widget';

export default function Widgets({ widgets = {}, columns = 1, seal, className = '' }) {
  const widgetEntries = Object.entries(widgets);

  if (widgetEntries.length === 0) {
    return null;
  }

  const gridClass = `grid gap-6 grid-cols-1 ${
    columns === 2 ? 'md:grid-cols-2' :
    columns === 3 ? 'md:grid-cols-3' :
    columns === 4 ? 'md:grid-cols-4' :
    ''
  }`;

  const getColspanClass = (colspan) => {
    if (!colspan || colspan === 1) return '';

    const maxSpan = Math.min(colspan, columns);

    // Use explicit class names for Tailwind purge/safelist
    const colspanClasses = {
      2: 'md:col-span-2',
      3: 'md:col-span-3',
      4: 'md:col-span-4',
    };

    return colspanClasses[maxSpan] || '';
  };

  return (
    <div className={`${gridClass} ${className}`}>
      {widgetEntries.map(([key, widgetProps]) => {
        const colspanClass = getColspanClass(widgetProps.colspan);

        return (
          <div key={key} className={colspanClass}>
            <Widget seal={seal} {...widgetProps} />
          </div>
        );
      })}
    </div>
  );
}
