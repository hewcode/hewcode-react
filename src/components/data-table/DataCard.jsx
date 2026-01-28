import { router } from '@inertiajs/react';
import { getTailwindBgClass, isHexColor } from '../../lib/colors.js';
import { cn } from '../../lib/utils.js';
import Action from '../actions/Action.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card.tsx';
import { Checkbox } from '../ui/checkbox.jsx';
import CellContent from './cell.jsx';

const DataCard = ({ record, titleColumn, subtitleColumn, imageColumn, contentColumns, isSelected, isBulkSelecting, onSelect, seal }) => {
  const hasRowUrl = !!record._row_url;
  const hasRowAction = !!record._row_action;
  const rowBgColor = record._row_bg_color;

  const handleCardClick = (e) => {
    // Don't navigate if clicking interactive elements
    const target = e.target;
    if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[role="button"]')) {
      return;
    }

    if (hasRowUrl) {
      router.visit(record._row_url);
    }
  };

  // Determine background styling (same as table rows)
  const tailwindBgClass = getTailwindBgClass(rowBgColor);
  const cardStyle = tailwindBgClass ? undefined : rowBgColor && isHexColor(rowBgColor) ? { backgroundColor: rowBgColor } : undefined;

  return (
    <Card
      className={cn('relative flex flex-col', hasRowUrl ? 'cursor-pointer transition-shadow hover:shadow-md' : '', tailwindBgClass)}
      style={cardStyle}
      onClick={handleCardClick}
    >
      {isBulkSelecting && (
        <div className="absolute left-4 top-4 z-10">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {imageColumn && record[imageColumn.key] && (
        <div className="aspect-video overflow-hidden">
          <CellContent record={record} column={imageColumn} />
        </div>
      )}

      {(titleColumn || subtitleColumn) && (
        <CardHeader>
          {titleColumn && (
            <CardTitle className="text-lg">
              <CellContent record={record} column={titleColumn} />
            </CardTitle>
          )}
          {subtitleColumn && (
            <CardDescription>
              <CellContent record={record} column={subtitleColumn} />
            </CardDescription>
          )}
        </CardHeader>
      )}

      {contentColumns.length > 0 && (
        <CardContent className="flex-1 space-y-2">
          {contentColumns.map((column) => (
            <div key={column.key} className="flex items-start gap-2">
              {column.label && <span className="text-muted-foreground min-w-[100px] text-sm font-medium">{column.label}:</span>}
              <div className="flex-1">
                <CellContent record={record} column={column} />
              </div>
            </div>
          ))}
        </CardContent>
      )}

      {record._row_actions && Object.keys(record._row_actions).length > 0 && (
        <CardFooter className="justify-end">
          <div className="flex items-center space-x-2">
            {Object.values(record._row_actions).map((action) => (
              <Action key={action.name} seal={seal} {...action} />
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataCard;
