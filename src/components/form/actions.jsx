import Action from '../actions/Action.jsx';

export default function Actions({
  seal,
  name,
  label,
  actions = [],
  className = '',
}) {
  if (!actions.length) {
    return null;
  }

  return (
    <div className={`actions-container ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Action
            key={action.name}
            seal={seal}
            {...action}
          />
        ))}
      </div>
    </div>
  );
}