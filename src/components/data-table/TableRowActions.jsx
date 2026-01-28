import { TableCell } from '../ui/table.jsx';

const TableRowActions = ({ actions = [] }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <TableCell className="text-right">
      <div className="space-x-2 flex items-center justify-end">{actions}</div>
    </TableCell>
  );
};

export default TableRowActions;