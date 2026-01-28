import { cn } from '../../lib/utils.js';
import DataCard from './DataCard.jsx';

const DataTableCards = ({ records, columns, cardLayoutConfig, selectedRecords, isBulkSelecting, onSelectRecord, seal }) => {
  // Organize columns by card role
  const titleColumn = columns.find((col) => col.cardRole === 'title');
  const subtitleColumn = columns.find((col) => col.cardRole === 'subtitle');
  const imageColumn = columns.find((col) => col.cardRole === 'image');
  const contentColumns = columns.filter((col) => col.cardRole === 'content');

  // Determine grid columns based on config
  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };
  const gridCols = gridColsMap[cardLayoutConfig.columns] || gridColsMap[3];

  return (
    <div className={cn('grid gap-4', gridCols)}>
      {records.map((record) => (
        <DataCard
          key={record.id}
          record={record}
          titleColumn={titleColumn}
          subtitleColumn={subtitleColumn}
          imageColumn={imageColumn}
          contentColumns={contentColumns}
          isSelected={selectedRecords.has(record.id)}
          isBulkSelecting={isBulkSelecting}
          onSelect={(checked) => onSelectRecord(record.id, checked)}
          seal={seal}
        />
      ))}
    </div>
  );
};

export default DataTableCards;
