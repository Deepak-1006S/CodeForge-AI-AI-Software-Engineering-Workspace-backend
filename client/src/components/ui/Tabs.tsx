import React from 'react';
import { cn } from '@/utils/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const variantStyles = {
    default: {
      list: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-2 text-sm font-medium transition-colors',
      active: 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    pills: {
      list: 'flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium rounded-md transition-all',
      active: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    underline: {
      list: 'space-x-8 border-b border-gray-200 dark:border-gray-700',
      tab: 'pb-3 text-sm font-medium transition-colors relative',
      active: 'text-primary-600 dark:text-primary-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div className={cn('flex', styles.list)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              styles.tab,
              tab.id === activeTab ? styles.active : styles.inactive,
              tab.disabled && 'opacity-50 cursor-not-allowed',
              'flex items-center gap-2'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
