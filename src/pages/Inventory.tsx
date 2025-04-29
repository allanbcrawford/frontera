import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import InventoryList from "@/components/inventory/InventoryList";
import AddInventoryForm from "@/components/inventory/AddInventoryForm";
import { Card } from "@/components/ui/card";
import { InventoryTree } from "@/components/inventory/InventoryTree";
import { useState } from "react";
import { inventoryApi } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/lib/database.types";

type Inventory = Database['public']['Tables']['inventory']['Row'];

export default function Inventory() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<{ type: 'category' | 'location' | null, value: string | null }>({
    type: null,
    value: null
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.list
  });

  const filteredInventory = selectedFilter.type === null ? inventory : inventory.filter(item => {
    if (selectedFilter.type === 'category') {
      if (selectedFilter.value === null) {
        return item.category === null;
      }
      return item.category === selectedFilter.value;
    } else {
      if (selectedFilter.value === null) {
        return item.location === null;
      }
      return item.location === selectedFilter.value;
    }
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage your supplies and equipment</p>
          </div>
          <AddInventoryForm />
        </div>
        
        <div className="flex gap-6">
          {/* Navigation Tree - 1/4 width */}
          <Card className="w-1/4 p-4">
            <InventoryTree 
              inventory={inventory}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
            />
          </Card>

          {/* Main Content - 3/4 width */}
          <Card className="flex-1 p-6">
            <InventoryList inventory={filteredInventory} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
