import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableHead } from '../ui/table.jsx';
import { cn } from '../../lib/utils';

const TableColumnHeader = ({ label, sortable = false, sortDirection, onSort, className, ...props }) => {
  return (
    <TableHead
      className={cn(className)}
      {...props}
    >
      {sortable ? (
        <button onClick={onSort} className="space-x-1 flex w-full cursor-pointer items-center justify-between">
          <span>{label}</span>
          <div className="ml-1 hover:text-gray-700">
            {sortDirection === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : sortDirection === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <div className="flex flex-col">
                <ChevronUp className="h-3 w-3 -mb-1" />
                <ChevronDown className="h-3 w-3" />
              </div>
            )}
          </div>
        </button>
      ) : (
        <span>{label}</span>
      )}
    </TableHead>
  );
};

export default TableColumnHeader;