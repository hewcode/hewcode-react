import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { GripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import useRoute from '../../hooks/use-route.ts';
import useTranslator from '../../hooks/useTranslator.js';
import { getTailwindBgClass, isHexColor } from '../../lib/colors.js';
import setUrlQuery from '../../utils/setUrlQuery.js';
import Action from '../actions/Action.jsx';
import { Checkbox } from '../ui/checkbox.jsx';
import { TableHeader as ShadcnTableHeader, Table, TableBody, TableCell, TableRow } from '../ui/table.jsx';
import BulkActions from './BulkActions.jsx';
import Pagination from './Pagination.jsx';
import TableColumnHeader from './TableColumnHeader.jsx';
import TableHeader from './TableHeader.jsx';
import TableRowActions from './TableRowActions.jsx';
import CellContent from './cell.jsx';

const DataTable = ({
  records = [],
  columns = [],
  allColumns = [],
  bulkActions = [],
  showSearch = true,
  showFilter = true,
  showActions = true,
  showPagination = true,
  searchPlaceholder,
  headerActions = [],
  sortable = [],
  filtersForm = null,
  deferFiltering = false,
  inlineFilters = false,
  tabs = [],
  activeTab = null,
  onSearch,
  onFilter,
  onTab,
  onSort,
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  urlPersistence = {
    persistFiltersInUrl: false,
    persistSortInUrl: false,
    persistColumnsInUrl: false,
    persistSearchInUrl: false,
  },
  currentValues = {
    search: null,
    sort: null,
    direction: null,
    filter: {},
    columns: {},
  },
  seal,
  thClassName = '',
  tdClassName = '',
  theadClassName = '',
  reorderable = null,
  requestScope = null,
  borderless = false,
}) => {
  if (!seal) {
    return <div className="w-full p-4 text-center font-mono font-bold text-red-600">Error: DataTable component did not receive proper props.</div>;
  }

  const route = useRoute();
  const { __ } = useTranslator();

  // Helper function to get scoped parameter name
  const getScopedParam = (paramName) => {
    if (requestScope && ['filter', 'search', 'sort', 'direction', 'columns', 'activeTab', 'clear'].includes(paramName)) {
      return `${requestScope}_${paramName}`;
    }
    return paramName;
  };

  const [sortConfig, setSortConfig] = useState({
    sort: currentValues.sort,
    direction: currentValues.direction,
  });
  const [filterState, setFilterState] = useState(currentValues.filter || {});
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [orderedRecords, setOrderedRecords] = useState(records);
  const [isReordering, setIsReordering] = useState(false);
  const [isBulkSelecting, setIsBulkSelecting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Update ordered records when records prop changes
  useEffect(() => {
    setOrderedRecords(records);
  }, [records]);

  // Initialize column visibility state based on togglable columns and their defaults
  const initializeColumnVisibility = () => {
    const savedVisibility = currentValues.columns || {};
    const visibility = {};

    allColumns.forEach((column) => {
      if (column.togglable) {
        // Check if there's a saved state, otherwise use the default
        if (savedVisibility.hasOwnProperty(column.key)) {
          visibility[column.key] = savedVisibility[column.key];
        } else {
          visibility[column.key] = !column.isToggledHiddenByDefault;
        }
      } else {
        // Non-togglable columns are always visible
        visibility[column.key] = true;
      }
    });

    return visibility;
  };

  const [columnVisibility, setColumnVisibility] = useState(initializeColumnVisibility);

  const handleSort = (columnKey, forceDirection = null) => {
    if (!sortable.includes(columnKey)) return;

    const direction = forceDirection ?? (sortConfig.sort === columnKey ? (sortConfig.direction === 'asc' ? 'desc' : null) : 'asc');

    if (!direction) {
      columnKey = null;
    }

    setSortConfig({ sort: columnKey, direction });

    if (onSort) {
      onSort?.(columnKey, direction);
    } else {
      let [url1, params] = setUrlQuery(getScopedParam('sort'), columnKey);
      const [url, params2] = setUrlQuery(getScopedParam('direction'), direction, url1);

      router.get(
        url,
        { ...params, ...params2 },
        {
          replace: true,
          preserveState: true,
          preserveUrl: !urlPersistence.persistSortInUrl,
        },
      );
    }
  };

  const handleToggleReordering = () => {
    if (!isReordering) {
      // Entering reorder mode - ensure table is sorted by reorderable column (asc)
      if (sortConfig.sort !== reorderable || sortConfig.direction !== 'asc') {
        handleSort(reorderable);
        // Wait a moment for the sort to complete, then enable reordering
        setTimeout(() => {
          setIsReordering(true);
        }, 100);
      } else {
        setIsReordering(true);
      }
    } else {
      router.reload({
        preserveScroll: true,
        preserveUrl: true,
        onSuccess: ({ props }) => {
          setSortConfig(props.posts.currentValues.sort);
          setIsReordering(false);
        },
      });
    }
  };

  // Handle column visibility changes
  const handleColumnVisibilityChange = (columnKey, isVisible) => {
    const newVisibility = { ...columnVisibility, [columnKey]: isVisible };
    setColumnVisibility(newVisibility);

    // Convert to array format - only include visible columns
    const visibleColumns = Object.entries(newVisibility)
      .filter(([key, visible]) => visible)
      .map(([key]) => key);

    // Save to URL for persistence
    const [url, params] = setUrlQuery(getScopedParam('columns'), visibleColumns);
    router.get(url, params, {
      replace: true,
      preserveState: true,
      preserveUrl: !urlPersistence.persistColumnsInUrl,
    });
  };

  // Handle bulk column visibility changes (for show all, hide all, reset)
  const handleBulkColumnVisibilityChange = (newVisibility, isReset = false) => {
    setColumnVisibility(newVisibility);

    // Convert to array format - only include visible columns
    const visibleColumns = Object.entries(newVisibility)
      .filter(([key, visible]) => visible)
      .map(([key]) => key);

    // Save to URL for persistence
    const [url, params] = setUrlQuery(getScopedParam('columns'), visibleColumns);

    // Add clear parameter when resetting columns
    if (isReset) {
      params[getScopedParam('clear')] = 'columns';
    }

    router.get(url, params, {
      replace: true,
      preserveState: true,
      preserveUrl: !urlPersistence.persistColumnsInUrl,
    });
  };

  // Filter visible columns based on visibility state
  const visibleColumns = columns.filter((column) => columnVisibility[column.key] !== false);

  // Bulk selection functions
  const hasBulkActions = bulkActions && bulkActions.length > 0;
  const allRecordIds = records.map((record) => record.id);
  const isAllSelected = allRecordIds.length > 0 && allRecordIds.every((id) => selectedRecords.has(id));
  const isIndeterminate = selectedRecords.size > 0 && !isAllSelected;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRecords(new Set(allRecordIds));
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleSelectRecord = (recordId, checked) => {
    const newSelection = new Set(selectedRecords);
    if (checked) {
      newSelection.add(recordId);
    } else {
      newSelection.delete(recordId);
    }
    setSelectedRecords(newSelection);
  };

  const handleToggleBulkSelection = () => {
    if (isBulkSelecting) {
      // Exiting bulk selection mode - clear selections
      setSelectedRecords(new Set());
      setIsBulkSelecting(false);
    } else {
      // Entering bulk selection mode
      setIsBulkSelecting(true);
    }
  };

  /* Apply filters */
  onFilter ||= (state) => {
    setFilterState(state);

    const [url, params] = setUrlQuery(getScopedParam('filter'), state);

    // Add clear parameter when clearing filters
    if (state === null) {
      params[getScopedParam('clear')] = 'filters';
    }

    router.get(url, params, {
      replace: true,
      preserveState: true,
      preserveUrl: !urlPersistence.persistFiltersInUrl,
    });
  };

  onTab ||= (tab) => {
    const [url, params] = setUrlQuery(getScopedParam('activeTab'), tab);

    // Add clear parameter when clearing tabs
    if (tab === null) {
      params[getScopedParam('clear')] = 'activeTab';
    }

    router.get(url, params, {
      replace: true,
      preserveState: true,
      preserveUrl: true,
    });
  };

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedRecords.findIndex((record) => record.id === active.id);
    const newIndex = orderedRecords.findIndex((record) => record.id === over.id);

    // Optimistically update the UI
    const newRecords = [...orderedRecords];
    const [movedItem] = newRecords.splice(oldIndex, 1);
    newRecords.splice(newIndex, 0, movedItem);
    setOrderedRecords(newRecords);

    // Send reorder request to backend
    fetch(route('hewcode.mount'), {
      method: 'POST',
      body: {
        seal,
        call: {
          name: 'mount',
          params: {
            name: 'reorder',
            args: [active.id, newIndex],
          },
        },
      },
    }).catch((error) => {
      // Revert on error
      setOrderedRecords(orderedRecords);
      console.error('Reorder failed:', error);
    });
  };

  // Use ordered records if reordering is active, otherwise use original records
  const displayRecords = isReordering ? orderedRecords : records;
  const isReorderingActive = reorderable && isReordering;

  // Sortable row component
  const SortableRow = ({ record, index, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: record.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const rowBgColor = record._row_bg_color;
    const tailwindBgClass = getTailwindBgClass(rowBgColor);
    const rowStyle = tailwindBgClass ? { ...style } : rowBgColor && isHexColor(rowBgColor) ? { ...style, backgroundColor: rowBgColor } : style;
    const rowClassName = tailwindBgClass || '';

    return (
      <TableRow ref={setNodeRef} style={rowStyle} className={rowClassName}>
        {children(attributes, listeners)}
      </TableRow>
    );
  };

  const rowActions = records.some((record) => record._row_actions);

  return (
    <div className="w-full">
      {((showSearch || showActions || filtersForm || allColumns.some((col) => col.togglable) || reorderable || hasBulkActions) && (
        <TableHeader
          showSearch={showSearch}
          showFilter={showFilter}
          showActions={showActions}
          searchPlaceholder={searchPlaceholder}
          filterState={filterState}
          filtersForm={filtersForm}
          deferFiltering={deferFiltering}
          inlineFilters={inlineFilters}
          tabs={tabs}
          activeTab={activeTab}
          onSearch={onSearch}
          onFilter={onFilter}
          onTab={onTab}
          headerActions={headerActions}
          allColumns={allColumns}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onBulkColumnVisibilityChange={handleBulkColumnVisibilityChange}
          urlPersistence={urlPersistence}
          currentValues={currentValues}
          seal={seal}
          reorderable={reorderable}
          isReordering={isReordering}
          onToggleReordering={handleToggleReordering}
          hasBulkActions={hasBulkActions}
          isBulkSelecting={isBulkSelecting}
          onToggleBulkSelection={handleToggleBulkSelection}
          getScopedParam={getScopedParam}
          borderless={borderless}
        />
      )) ||
        null}

      {isBulkSelecting && selectedRecords.size > 0 && (
        <BulkActions
          selectedCount={selectedRecords.size}
          bulkActions={bulkActions}
          selectedRecords={Array.from(selectedRecords)}
          onClearSelection={() => setSelectedRecords(new Set())}
        />
      )}

      <div
        className={clsx('bg-box rounded-md shadow-sm', {
          'border-box-border border': !borderless,
        })}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <ShadcnTableHeader className={theadClassName}>
              <TableRow>
                {isReorderingActive && <TableColumnHeader label="" className={`${thClassName} w-8`} />}
                {isBulkSelecting && (
                  <TableColumnHeader
                    label={
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onCheckedChange={handleSelectAll}
                        aria-label={__('hewcode.common.select_all')}
                      />
                    }
                    className={thClassName}
                  />
                )}
                {visibleColumns
                  .filter((col) => !col.hidden)
                  .map((column) => (
                    <TableColumnHeader
                      key={column.key}
                      label={column.label}
                      sortable={sortable.includes(column.key)}
                      sortDirection={sortConfig.sort === column.key ? sortConfig.direction : null}
                      onSort={() => handleSort(column.key)}
                      colSpan={rowActions && column.key === visibleColumns[visibleColumns.length - 1].key ? 2 : 1}
                      className={thClassName}
                    />
                  ))}
              </TableRow>
            </ShadcnTableHeader>
            <SortableContext items={displayRecords.map((r) => r.id)} strategy={verticalListSortingStrategy} disabled={!isReorderingActive}>
              <TableBody>
                {displayRecords.map((record, index) => {
                  const hasRowUrl = !!record._row_url;
                  const hasRowAction = !!record._row_action;
                  const handleRowClick = (e) => {
                    if ((hasRowUrl || hasRowAction) && !isReorderingActive && !isBulkSelecting) {
                      // Don't navigate if clicking on interactive elements
                      const target = e.target;
                      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[role="button"]')) {
                        return;
                      }

                      // Trigger action if specified
                      if (hasRowAction) {
                        const actionButton = document.querySelector(
                          `button[data-record-id="${record.id}"][data-action-name="${record._row_action}"]`,
                        );
                        if (actionButton) {
                          actionButton.click();
                          return;
                        }
                      }

                      // Fall back to URL navigation
                      if (hasRowUrl) {
                        router.visit(record._row_url);
                      }
                    }
                  };

                  const renderRowContent = (attributes = {}, listeners = {}) => (
                    <>
                      {isReorderingActive && (
                        <TableCell className={`${tdClassName} cursor-grab active:cursor-grabbing`} {...attributes} {...listeners}>
                          <GripVertical className="text-muted-foreground h-4 w-4" />
                        </TableCell>
                      )}
                      {isBulkSelecting && (
                        <TableCell className={tdClassName}>
                          <Checkbox
                            checked={selectedRecords.has(record.id)}
                            onCheckedChange={(checked) => handleSelectRecord(record.id, checked)}
                            aria-label={`Select record ${record.id}`}
                          />
                        </TableCell>
                      )}
                      {visibleColumns
                        .filter((col) => !col.hidden)
                        .map((column) => (
                          <TableCell
                            key={column.key}
                            className={`${tdClassName} ${column.wrap ? 'whitespace-normal break-words' : 'whitespace-nowrap'}`}
                          >
                            <CellContent record={record} column={column} />
                          </TableCell>
                        ))}
                      <TableRowActions
                        actions={
                          record._row_actions
                            ? Object.values(record._row_actions).map((action) => <Action key={action.name} seal={seal} {...action} />)
                            : null
                        }
                      />
                    </>
                  );

                  if (isReorderingActive) {
                    return (
                      <SortableRow key={record.id || index} record={record} index={index}>
                        {(attributes, listeners) => renderRowContent(attributes, listeners)}
                      </SortableRow>
                    );
                  }

                  const rowBgColor = record._row_bg_color;
                  const tailwindBgClass = getTailwindBgClass(rowBgColor);
                  const rowStyle = tailwindBgClass ? undefined : rowBgColor && isHexColor(rowBgColor) ? { backgroundColor: rowBgColor } : undefined;
                  const rowClassName = `${tailwindBgClass || ''} ${hasRowUrl || hasRowAction ? 'cursor-pointer hover:bg-muted/50' : ''}`;

                  return (
                    <TableRow key={record.id || index} style={rowStyle} className={rowClassName} onClick={handleRowClick}>
                      {renderRowContent()}
                    </TableRow>
                  );
                })}
              </TableBody>
            </SortableContext>
          </Table>
        </DndContext>
      </div>

      {pagination.totalPages > 1 && (
        <div
          className={clsx('bg-box border-box-border mt-2 rounded-md p-4 shadow-sm', {
            border: !borderless,
            'rounded-t-none border-t': borderless,
          })}
        >
          <Pagination
            showPagination={showPagination}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            requestScope={requestScope}
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
