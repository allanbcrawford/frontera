import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/lib/database.types";
import { inventoryApi } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Inventory = Database['public']['Tables']['inventory']['Row'];
type InventoryUpdate = Database['public']['Tables']['inventory']['Update'];

interface EditInventoryFormProps {
  item: Inventory;
}

const NO_CATEGORY = "__no_category__";
const NO_LOCATION = "__no_location__";
const NEW_CATEGORY = "__new_category__";
const NEW_LOCATION = "__new_location__";

export function EditInventoryForm({ item }: EditInventoryFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    quantity: item.quantity.toString(),
    unit: item.unit,
    category: item.category || NO_CATEGORY,
    location: item.location || NO_LOCATION,
    expiry_date: item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : "",
    status: item.status || "",
    newCategory: "",
    newLocation: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all inventory items to get unique categories and locations
  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.list
  });

  // Get unique categories and locations
  const categories = Array.from(new Set(inventory.map(item => item.category).filter(Boolean)));
  const locations = Array.from(new Set(inventory.map(item => item.location).filter(Boolean)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: InventoryUpdate = {
        name: formData.name,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        category: formData.category === NEW_CATEGORY ? formData.newCategory : 
                 formData.category === NO_CATEGORY ? null : 
                 formData.category,
        location: formData.location === NEW_LOCATION ? formData.newLocation :
                 formData.location === NO_LOCATION ? null :
                 formData.location,
        expiry_date: formData.expiry_date || null,
        status: formData.status || null
      };

      await inventoryApi.update(item.id, updateData);

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      // Refresh the inventory list
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setOpen(false);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_CATEGORY}>+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
              {formData.category === NEW_CATEGORY && (
                <Input
                  className="mt-2"
                  placeholder="Enter new category"
                  value={formData.newCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, newCategory: e.target.value }))}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_LOCATION}>No Location</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_LOCATION}>+ Add New Location</SelectItem>
                </SelectContent>
              </Select>
              {formData.location === NEW_LOCATION && (
                <Input
                  className="mt-2"
                  placeholder="Enter new location"
                  value={formData.newLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, newLocation: e.target.value }))}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input
              id="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              placeholder="Optional"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 