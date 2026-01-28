import { router } from '@inertiajs/react';
import { clsx } from 'clsx';
import { ArrowUpDown, ListChecks, Search, X } from 'lucide-react';
import { useState } from 'react';
import { throttle } from 'throttle-debounce';
import { useIsMobile } from '../../hooks/use-mobile.tsx';
import useTranslator from '../../hooks/useTranslator.js';
import setUrlQuery from '../../utils/setUrlQuery.js';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import ColumnsPopover from './ColumnsPopover.jsx';
import FiltersPopover, { FiltersForm } from './FiltersPopover.jsx';
import SortControl from './SortControl.jsx';
import TabsActions from './TabsActions.jsx';

const performSearch = throttle(650, (e, urlPersistence, getScopedParam) => {
  const [url, params] = setUrlQuery(getScopedParam('search'), e.target.value);

  router.get(url, params, {
    replace: true,
    preserveState: true,
    preserveUrl: !urlPersistence?.persistSearchInUrl,
  });
});

const TableHeader = ({
  showSearch = true,
  showFilter = true,
  showActions = true,
  showSortControl = false,
  searchPlaceholder,
  onSearch,
  onFilter,
  onTab,
  onSort,
  filterState,
  filtersForm,
  deferFiltering,
  inlineFilters = false,
  headerActions = [],
  tabs = [],
  activeTab = null,
  allColumns = [],
  columnVisibility = {},
  onColumnVisibilityChange,
  onBulkColumnVisibilityChange,
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
  sortable = [],
  reorderable = null,
  isReordering = false,
  onToggleReordering = null,
  hasBulkActions = false,
  isBulkSelecting = false,
  onToggleBulkSelection = null,
  getScopedParam = (param) => param,
  seal,
  borderless = false,
}) => {
  const [search, setSearch] = useState(currentValues.search || '');
  const { __ } = useTranslator();
  const isMobile = useIsMobile();

  searchPlaceholder ||= __('hewcode.common.search') + '...';

  const hasFilters = showFilter && filtersForm;
  const activeFiltersCount = hasFilters ? Object.entries(filterState || {}).filter(([_, value]) => value !== null && value !== '').length : 0;
  const showInlineFilters = inlineFilters && !isMobile;

  return (
    <>
      <div
        className={clsx('bg-box border-box-border mb-2 flex items-center justify-between rounded-md p-4 shadow-sm', {
          border: !borderless,
          'rounded-none border-b': borderless,
        })}
      >
        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                value={search || ''}
                placeholder={searchPlaceholder}
                className="pl-10"
                onChange={(e) => {
                  setSearch(e.target.value);

                  if (onSearch) {
                    onSearch(e.target.value);
                  } else {
                    performSearch(e, urlPersistence, getScopedParam);
                  }
                }}
              />
            </div>
          )}
          {hasFilters && !showInlineFilters && (
            <FiltersPopover state={filterState} onFilter={onFilter} deferFiltering={deferFiltering} filtersForm={filtersForm} seal={seal} />
          )}
          {allColumns.some((col) => col.togglable) && (
            <ColumnsPopover
              columns={allColumns}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={onColumnVisibilityChange}
              onBulkColumnVisibilityChange={onBulkColumnVisibilityChange}
            />
          )}
          {reorderable && (
            <Button
              variant={isReordering ? 'default' : 'outline'}
              size="icon"
              onClick={onToggleReordering}
              className="h-9 w-9"
              title={isReordering ? __('hewcode.common.done') : __('hewcode.common.reorder')}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          )}
          {hasBulkActions && (
            <Button
              variant={isBulkSelecting ? 'default' : 'outline'}
              size="icon"
              onClick={onToggleBulkSelection}
              className="h-9 w-9"
              title={isBulkSelecting ? __('hewcode.common.done') : __('hewcode.common.bulk_select')}
            >
              <ListChecks className="h-4 w-4" />
            </Button>
          )}
          {showSortControl && (
            <SortControl
              columns={allColumns}
              sortConfig={{ sort: currentValues.sort, direction: currentValues.direction }}
              onSort={onSort}
              sortable={sortable}
            />
          )}
          {/*separator between above items and the tabs when needed*/}
          {(showSearch ||
            (showFilter && filtersForm) ||
            allColumns.some((col) => col.togglable) ||
            reorderable ||
            hasBulkActions ||
            showSortControl) &&
            tabs.length > 0 && <div className="ml-2 mr-4 h-6 w-px bg-gray-200 dark:bg-gray-800" />}
          {tabs.length > 0 && <TabsActions tabs={tabs} activeTab={activeTab} onTabChange={onTab} />}
        </div>
        {showActions && headerActions.length > 0 && <div className="flex items-center space-x-2">{headerActions}</div>}
      </div>
      {hasFilters && showInlineFilters && (
        <div className={`bg-box border-box-border relative mb-2 rounded-md border p-4 shadow-sm ${activeFiltersCount > 0 ? 'pr-12' : ''}`}>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={() => onFilter(null)}
              title={__('hewcode.common.clear_all')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <FiltersForm deferFiltering={deferFiltering} state={filterState} onFilter={onFilter} filtersForm={filtersForm} inline={true} />
        </div>
      )}
    </>
  );
};

export default TableHeader;
