import { getTailwindBadgeClasses, isHexColor } from '../../lib/colors.js';
import { Icon } from '../icon-registry.jsx';
import Fragment from '../support/fragment.jsx';

export default function CellContent({ record, column }) {
  if (column.render) {
    return column.render(record[column.key], record);
  }

  const beforeContent = record[column.key + '_before'];
  const afterContent = record[column.key + '_after'];
  const color = record[column.key + '_color'];
  const iconData = record[column.key + '_icon'];

  // Create icon element if icon data exists
  const iconElement = iconData ? <Icon icon={iconData} /> : null;

  const value = record[column.key];

  // Handle image columns
  if (column.columnType === 'image') {
    if (!value) return null;

    const width = column.width;
    const height = column.height;
    const circular = column.circular;
    const isCardImage = column.cardRole === 'image';

    // For card images, let the container handle sizing (aspect-video)
    if (isCardImage) {
      return <img src={value} alt="" className="h-full w-full object-cover" />;
    }

    // For table images, apply specific dimensions
    const imgClasses = circular ? 'rounded-full object-cover' : 'rounded object-cover';
    const style = {};
    if (width) style.width = `${width}px`;
    if (height) style.height = `${height}px`;

    return <img src={value} alt="" className={imgClasses} style={style} />;
  }

  // Badge color is already in the Fragment data, so just use Fragment as-is for badges
  let mainContent = <Fragment value={value} />;

  // Apply color to non-badge text only
  if (color && !(value instanceof Object && '__hcf' in value && value._badge)) {
    const textColorClasses = getTailwindBadgeClasses(color);
    const hexColor = isHexColor(color) ? color : null;

    if (hexColor) {
      mainContent = <span style={{ color: hexColor }}>{mainContent}</span>;
    } else if (textColorClasses) {
      mainContent = <span className={textColorClasses}>{mainContent}</span>;
    }
  }

  if (!column.badge && iconElement) {
    if (iconData.position === 'before') {
      mainContent = (
        <span className="inline-flex items-center gap-2">
          {iconElement}
          {mainContent}
        </span>
      );
    } else if (iconData.position === 'after') {
      mainContent = (
        <span className="inline-flex items-center gap-2">
          {mainContent}
          {iconElement}
        </span>
      );
    }
  }

  // If there's before or after content, wrap in a div
  if (beforeContent || afterContent) {
    return (
      <div className="space-y-1">
        {beforeContent && (
          <div className="text-muted-foreground text-xs">
            <Fragment value={beforeContent} />
          </div>
        )}
        <div>{mainContent}</div>
        {afterContent && (
          <div className="text-muted-foreground text-xs">
            <Fragment value={afterContent} />
          </div>
        )}
      </div>
    );
  }

  return mainContent;
}
