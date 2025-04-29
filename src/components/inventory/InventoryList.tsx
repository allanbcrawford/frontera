import { useState } from 'react';
import { Input } from '../ui/input';
import { deleteInventoryItem } from '@/lib/api';
import type { Database } from '@/lib/database.types';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { EditInventoryForm } from './EditInventoryForm';

type Inventory = Database['public']['Tables']['inventory']['Row'];

interface InventoryListProps {
  inventory: Inventory[];
}

export default function InventoryList({ inventory }: InventoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (item: Inventory) => {
    if (item.status === 'Expiring Soon') {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    }
    return null;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="p-4 hover:bg-accent/5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  {item.category && (
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                  )}
                  {getStatusBadge(item)}
                </div>
                <div className="mt-2 text-sm text-gray-500 space-x-2">
                  <span>Qty: {item.quantity} {item.unit}</span>
                  <span>•</span>
                  <span>Location: {item.location || 'No Location'}</span>
                  {item.expiry_date && (
                    <>
                      <span>•</span>
                      <span>Expires: {new Date(item.expiry_date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditInventoryForm item={item} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredInventory.length === 0 && (
          <p className="text-center text-gray-500">No inventory items found</p>
        )}
      </div>
    </div>
  );
}
