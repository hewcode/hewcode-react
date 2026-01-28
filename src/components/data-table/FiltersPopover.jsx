import { Filter } from 'lucide-react';
import useTranslator from '../../hooks/useTranslator.js';
import Form from '../form/Form.jsx';
import CompactButton from '../support/compact-button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';

// Shared filter form component
export function FiltersForm({ seal, deferFiltering, state, onFilter, filtersForm, inline = false }) {
  const { __ } = useTranslator();
  const activeFiltersCount = Object.entries(state || {}).filter(([_, value]) => value !== null && value !== '').length;

  if (inline) {
    return (
      <div className={inline ? '' : 'space-y-3'}>
        <Form
          {...filtersForm}
          seal={seal}
          className={inline ? 'flex flex-wrap items-end gap-4' : ''}
          onChange={(newState) => {
            if (deferFiltering) return;

            onFilter(newState);
          }}
          additionalFooterActions={(state) =>
            [
              deferFiltering && (
                <Button
                  key="apply-filters"
                  type="button"
                  variant={'default'}
                  onClick={() => {
                    onFilter(state);
                  }}
                >
                  {__('hewcode.common.apply_filters')}
                </Button>
              ),
            ].filter(Boolean)
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{__('hewcode.common.filters')}</h4>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {activeFiltersCount} {activeFiltersCount === 1 ? __('hewcode.common.filter') : __('hewcode.common.filters')}{' '}
              {__('hewcode.common.active')}
            </span>
            <CompactButton onClick={() => onFilter(null)} variant="ghost">
              {__('hewcode.common.clear_all')}
            </CompactButton>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Form
          {...filtersForm}
          seal={seal}
          onChange={(newState) => {
            if (deferFiltering) return;

            onFilter(newState);
          }}
          additionalFooterActions={(state) =>
            [
              deferFiltering && (
                <Button
                  key="apply-filters"
                  type="button"
                  variant={'default'}
                  onClick={() => {
                    onFilter(state);
                  }}
                >
                  {__('hewcode.common.apply_filters')}
                </Button>
              ),
            ].filter(Boolean)
          }
        />
      </div>
    </div>
  );
}

export default function FiltersPopover({ seal, deferFiltering, state, onFilter, filtersForm }) {
  const { __ } = useTranslator();
  const activeFiltersCount = Object.entries(state || {}).filter(([_, value]) => value !== null && value !== '').length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative gap-2">
          <Filter className="h-4 w-4" />
          {!!activeFiltersCount && (
            <Badge variant="secondary" className="absolute -right-2 -top-2 ml-1 h-5 w-5 rounded-full px-1 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <FiltersForm deferFiltering={deferFiltering} state={state} onFilter={onFilter} filtersForm={filtersForm} seal={seal} />
      </PopoverContent>
    </Popover>
  );
}
