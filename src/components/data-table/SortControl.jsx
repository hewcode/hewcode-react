import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu.tsx';

const SortControl = ({ columns, sortConfig, onSort, sortable }) => {
  const { sort, direction } = sortConfig;

  // Find the currently sorted column
  const sortedColumn = columns.find((col) => col.key === sort);
  const sortLabel = sortedColumn?.label || 'Sort by';

  // Filter to only sortable columns
  const sortableColumns = columns.filter((col) => sortable.includes(col.key));

  if (sortableColumns.length === 0) {
    return null;
  }

  const handleDirectionToggle = () => {
    if (!sort) return; // No column selected yet

    // Toggle: asc -> desc -> null (clear)
    const newDirection = direction === 'asc' ? 'desc' : 'asc';

    onSort(sort, newDirection);
  };

  const handleColumnSelect = (columnKey) => {
    // When selecting a new column, default to asc
    onSort(columnKey, columnKey === sort ? direction : 'asc');
  };

  return (
    <div className="flex items-center">
      {/* Direction toggle button */}
      <Button variant="outline" onClick={handleDirectionToggle} disabled={!sort} className="rounded-r-none border-r-0">
        {direction === 'asc' && <ArrowUp className="h-4 w-4" />}
        {direction === 'desc' && <ArrowDown className="h-4 w-4" />}
      </Button>
      {/* Column selector dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-l-none">
            <span className="mr-2">{sortLabel}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortableColumns.map((column) => (
            <DropdownMenuItem key={column.key} onClick={() => handleColumnSelect(column.key)} className={column.key === sort ? 'bg-accent' : ''}>
              {column.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortControl;
