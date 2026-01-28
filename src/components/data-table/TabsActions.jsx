import { Button } from '../ui/button.jsx';

export default function TabsActions({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <Button
          variant={tab.active ? 'default' : 'outline'}
          key={tab.name}
          type="button"
          onClick={() => onTabChange(activeTab === tab.name ? null : tab.name)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
