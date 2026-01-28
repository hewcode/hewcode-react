import { useHewcode } from '../contexts/hewcode-context.tsx';

/**
 * SVG Sprite Registry Component
 *
 * Renders a hidden SVG element containing symbol definitions for icons.
 * This allows icons to be referenced by name using <svg><use/></svg> without
 * duplicating SVG content throughout the DOM.
 *
 * @param {Object.<string, string>} icons - Map of icon names to SVG strings
 */
export function IconRegistry() {
  const { icons } = useHewcode().hewcode;

  if (!icons || Object.keys(icons).length === 0) {
    return null;
  }

  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      {Object.entries(icons).map(([name, svg]) => {
        // Extract the SVG content and wrap it in a symbol
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) return null;

        return (
          <symbol key={name} id={name} viewBox={svgElement.getAttribute('viewBox') || '0 0 24 24'}>
            <g dangerouslySetInnerHTML={{ __html: svgElement.innerHTML }} />
          </symbol>
        );
      })}
    </svg>
  );
}

/**
 * Icon Component
 *
 * Renders an icon from the registry or falls back to a React component.
 *
 * @param {Object} props
 * @param {string|Object} props.icon - Icon reference {name: string, size?: number, position?: string} or icon name string
 * @param {React.ComponentType} [props.fallbackComponent] - Fallback component if icon is a React component
 * @param {string} [props.className] - CSS classes
 * @param {number} [props.size] - Icon size (overrides icon.size)
 */
export function Icon({ icon, fallbackComponent: FallbackComponent, className = '', size }) {
  // If icon is a reference object with name
  if (icon && typeof icon === 'object' && icon.name) {
    const iconSize = size || icon.size || 16;

    return (
      <svg
        width={iconSize}
        height={iconSize}
        className={className || 'inline-block !size-auto flex-shrink-0'}
        style={{ width: iconSize, height: iconSize }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <use href={`#${icon.name}`} />
      </svg>
    );
  }

  // If icon is a string (legacy support)
  if (typeof icon === 'string') {
    const iconSize = size || 16;

    return (
      <svg
        width={iconSize}
        height={iconSize}
        className={className || 'inline-block !size-auto flex-shrink-0'}
        style={{ width: iconSize, height: iconSize }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <use href={`#${icon}`} />
      </svg>
    );
  }

  // If icon is a React component (fallback for existing usage)
  if (FallbackComponent) {
    return <FallbackComponent className={className} />;
  }

  return null;
}
