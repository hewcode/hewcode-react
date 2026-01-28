import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import useRoute from '../../hooks/use-route.ts';
import useTranslator from '../../hooks/useTranslator.js';
import { Button } from '../ui/button.jsx';

const BulkActions = ({ selectedCount, bulkActions, selectedRecords, onClearSelection }) => {
  const route = useRoute();
  const { __ } = useTranslator();

  const executeAction = (action) => {
    router.post(
      route('hewcode.mount'),
      {
        component: action.component,
        route: action.route,
        hash: action.hash,
        context: {
          recordIds: selectedRecords,
        },
        call: {
          name: 'mountAction',
          params: {
            name: action.name,
            args: {},
          },
        },
      },
      {
        onSuccess: () => {
          onClearSelection();
        },
        onError: (errors) => {
          console.error('Bulk action failed:', errors);
        },
      },
    );
  };

  const getButtonVariant = (color) => {
    switch (color) {
      case 'danger':
        return 'destructive';
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </span>

        <div className="flex items-center gap-2">
          {bulkActions.map((action) => (
            <Button key={action.name} variant={getButtonVariant(action.color)} size="sm" onClick={() => executeAction(action)}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={onClearSelection} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
        <span className="sr-only">{__('hewcode.common.clear_selection')}</span>
      </Button>
    </div>
  );
};

export default BulkActions;
