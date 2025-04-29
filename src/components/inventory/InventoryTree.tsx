import { ChevronRight, ChevronDown, FolderIcon, MapPinIcon, LayoutGridIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Database } from '@/lib/database.types';

type Inventory = Database['public']['Tables']['inventory']['Row'];

type TreeProps = {
  inventory: Inventory[];
  onSelectFilter: (filter: { type: 'category' | 'location' | null, value: string | null }) => void;
  selectedFilter: { type: 'category' | 'location' | null, value: string | null };
};

type TreeNode = {
  name: string;
  count: number;
};

export function InventoryTree({ inventory, onSelectFilter, selectedFilter }: TreeProps) {
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [locationExpanded, setLocationExpanded] = useState(true);

  // Get unique categories and their counts
  const categories = inventory.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique locations and their counts
  const locations = inventory.reduce((acc, item) => {
    const location = item.location || 'No Location';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderTreeItems = (items: Record<string, number>, type: 'category' | 'location') => {
    return Object.entries(items).map(([name, count]) => (
      <Button
        key={`${type}-${name}`}
        variant="ghost"
        className={cn(
          "w-full justify-start pl-8 mb-1 font-normal",
          selectedFilter.type === type && selectedFilter.value === (name === 'Uncategorized' || name === 'No Location' ? null : name)
            ? "bg-accent"
            : ""
        )}
        onClick={() => onSelectFilter({
          type,
          value: name === 'Uncategorized' || name === 'No Location' ? null : name
        })}
      >
        {name} ({count})
      </Button>
    ));
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="pr-4">
        {/* All Items */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start mb-4 font-normal",
            selectedFilter.type === null ? "bg-accent" : ""
          )}
          onClick={() => onSelectFilter({ type: null, value: null })}
        >
          <LayoutGridIcon className="mr-2 h-4 w-4" />
          All Items ({inventory.length})
        </Button>

        {/* Categories Section */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="w-full justify-start mb-1"
            onClick={() => setCategoryExpanded(!categoryExpanded)}
          >
            {categoryExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            <FolderIcon className="mr-2 h-4 w-4" />
            Categories
          </Button>
          {categoryExpanded && renderTreeItems(categories, 'category')}
        </div>

        {/* Locations Section */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start mb-1"
            onClick={() => setLocationExpanded(!locationExpanded)}
          >
            {locationExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            <MapPinIcon className="mr-2 h-4 w-4" />
            Locations
          </Button>
          {locationExpanded && renderTreeItems(locations, 'location')}
        </div>
      </div>
    </ScrollArea>
  );
} 