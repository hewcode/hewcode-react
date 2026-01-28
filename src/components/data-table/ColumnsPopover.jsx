import { Check, Columns3 } from 'lucide-react';
import useTranslator from '../../hooks/useTranslator.js';
import CompactButton from '../support/compact-button.jsx';
import { Button } from '../ui/button.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';

export default function ColumnsPopover({ columns, columnVisibility, onColumnVisibilityChange, onBulkColumnVisibilityChange }) {
  const { __ } = useTranslator();

  const togglableColumns = columns.filter((col) => col.togglable);

  const handleShowAll = () => {
    const newVisibility = { ...columnVisibility };
    togglableColumns.forEach((column) => {
      newVisibility[column.key] = true;
    });

    if (onBulkColumnVisibilityChange) {
      onBulkColumnVisibilityChange(newVisibility);
    } else {
      // Fallback to individual calls if bulk function not available
      togglableColumns.forEach((column) => {
        if (!columnVisibility[column.key]) {
          onColumnVisibilityChange(column.key, true);
        }
      });
    }
  };

  const handleHideAll = () => {
    const newVisibility = { ...columnVisibility };
    togglableColumns.forEach((column) => {
      newVisibility[column.key] = false;
    });

    if (onBulkColumnVisibilityChange) {
      onBulkColumnVisibilityChange(newVisibility);
    } else {
      // Fallback to individual calls if bulk function not available
      togglableColumns.forEach((column) => {
        if (columnVisibility[column.key]) {
          onColumnVisibilityChange(column.key, false);
        }
      });
    }
  };

  const handleReset = () => {
    const newVisibility = { ...columnVisibility };
    togglableColumns.forEach((column) => {
      newVisibility[column.key] = !column.isToggledHiddenByDefault;
    });

    if (onBulkColumnVisibilityChange) {
      onBulkColumnVisibilityChange(newVisibility, true); // true indicates this is a reset
    } else {
      // Fallback to individual calls if bulk function not available
      togglableColumns.forEach((column) => {
        const defaultVisibility = !column.isToggledHiddenByDefault;
        if (columnVisibility[column.key] !== defaultVisibility) {
          onColumnVisibilityChange(column.key, defaultVisibility);
        }
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="gap-2">
          <Columns3 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{__('hewcode.common.toggle_columns') || 'Toggle Columns'}</h4>
            <div className="flex gap-1">
              <CompactButton onClick={handleShowAll} variant="ghost" size="sm">
                {__('hewcode.common.show_all') || 'Show all'}
              </CompactButton>
              <CompactButton onClick={handleHideAll} variant="ghost" size="sm">
                {__('hewcode.common.hide_all') || 'Hide all'}
              </CompactButton>
              <CompactButton onClick={handleReset} variant="ghost" size="sm">
                {__('hewcode.common.reset') || 'Reset'}
              </CompactButton>
            </div>
          </div>

          <div className="space-y-3">
            {togglableColumns.map((column) => (
              <div key={column.key} className="flex items-center space-x-2">
                <div
                  className="border-primary flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border"
                  onClick={() => onColumnVisibilityChange(column.key, !columnVisibility[column.key])}
                >
                  {columnVisibility[column.key] && <Check className="h-3 w-3" />}
                </div>
                <label
                  className="flex-1 cursor-pointer text-sm font-medium"
                  onClick={() => onColumnVisibilityChange(column.key, !columnVisibility[column.key])}
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>

          {togglableColumns.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {__('hewcode.common.no_togglable_columns') || 'No columns can be toggled'}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
