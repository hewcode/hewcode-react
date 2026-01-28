import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { useState } from 'react';
import useRoute from '../../hooks/use-route.ts';
import useTranslator from '../../hooks/useTranslator.js';
import setUrlQuery from '../../utils/setUrlQuery.js';
import BulkActions from './BulkActions.jsx';
import DataTableCards from './DataTableCards.jsx';
import Pagination from './Pagination.jsx';
import TableHeader from './TableHeader.jsx';

/**
 * DataCards component - Renders listing data as cards
 * Similar to DataTable but optimized for card layout
 */
const DataCards = ({
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
  requestScope = null,
  borderless = false,
  cardLayoutConfig = { columns: 3, aspectRatio: null },
}) => {
  if (!seal) {
    return <div className="w-full p-4 text-center font-mono font-bold text-red-600">Error: DataCards component did not receive proper props.</div>;
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
  const [isBulkSelecting, setIsBulkSelecting] = useState(false);

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

  const handleSelectRecord = (recordId, checked) => {
    const newSelectedRecords = new Set(selectedRecords);
    if (checked) {
      newSelectedRecords.add(recordId);
    } else {
      newSelectedRecords.delete(recordId);
    }
    setSelectedRecords(newSelectedRecords);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRecords(new Set(records.map((r) => r.id)));
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleToggleBulkSelecting = () => {
    setIsBulkSelecting(!isBulkSelecting);
    if (isBulkSelecting) {
      setSelectedRecords(new Set());
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

  /* Handle tab changes */
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

  // Filter visible columns
  const visibleColumns = columns.filter((col) => !col.hidden);

  // Check if all are selected
  const isAllSelected = records.length > 0 && selectedRecords.size === records.length;
  const isIndeterminate = selectedRecords.size > 0 && selectedRecords.size < records.length;

  return (
    <div className="w-full space-y-4">
      {(showSearch || showFilter || showActions || bulkActions.length > 0 || tabs.length > 0 || (headerActions && headerActions.length > 0)) && (
        <TableHeader
          showSearch={showSearch}
          showFilter={showFilter}
          showActions={showActions}
          showSortControl={true}
          searchPlaceholder={searchPlaceholder}
          filtersForm={filtersForm}
          deferFiltering={deferFiltering}
          inlineFilters={inlineFilters}
          headerActions={headerActions}
          tabs={tabs}
          activeTab={activeTab}
          onSearch={onSearch}
          onFilter={onFilter}
          onTab={onTab}
          onSort={handleSort}
          sortable={sortable}
          urlPersistence={urlPersistence}
          currentValues={currentValues}
          seal={seal}
          bulkActions={bulkActions}
          isBulkSelecting={isBulkSelecting}
          onToggleBulkSelecting={handleToggleBulkSelecting}
          showReorderButton={false}
          isReordering={false}
          onToggleReordering={() => {}}
          showColumnVisibility={false}
          allColumns={allColumns}
          columnVisibility={{}}
          onColumnVisibilityChange={() => {}}
          hasBulkActions={bulkActions.length > 0}
          onToggleBulkSelection={handleToggleBulkSelecting}
          getScopedParam={getScopedParam}
          borderless={borderless}
        />
      )}

      {isBulkSelecting && selectedRecords.size > 0 && (
        <BulkActions
          selectedCount={selectedRecords.size}
          bulkActions={bulkActions}
          selectedRecords={Array.from(selectedRecords)}
          onClearSelection={() => setSelectedRecords(new Set())}
        />
      )}

      <DataTableCards
        records={records}
        columns={visibleColumns}
        cardLayoutConfig={cardLayoutConfig}
        selectedRecords={selectedRecords}
        isBulkSelecting={isBulkSelecting}
        onSelectRecord={handleSelectRecord}
        seal={seal}
      />

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
            onPageChange={(page) => {
              const [url, params] = setUrlQuery(requestScope ? `${requestScope}_page` : 'page', page);
              router.get(url, params, {
                replace: true,
                preserveState: true,
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DataCards;
