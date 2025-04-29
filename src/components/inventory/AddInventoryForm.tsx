import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { createInventoryItem } from '@/lib/api';
import { useToast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';
import { Plus } from 'lucide-react';
import { Database } from '@/lib/database.types';

const CATEGORIES = ['Water', 'Food', 'Medical', 'Energy', 'Communication'] as const;

type InventoryFormData = {
  name: string;
  category: typeof CATEGORIES[number];
  quantity: string;
  unit: string;
  location: string;
  expiry_date: string;
  description: string;
  status: string;
};

export default function AddInventoryForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    category: CATEGORIES[0],
    quantity: '',
    unit: '',
    location: '',
    expiry_date: '',
    description: '',
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity)) {
        throw new Error('Quantity must be a number');
      }

      await createInventoryItem({
        name: formData.name,
        category: formData.category,
        quantity,
        unit: formData.unit,
        location: formData.location,
        expiry_date: formData.expiry_date || null,
        description: formData.description,
        status: formData.status
      });

      toast({
        title: 'Success',
        description: 'Inventory item added successfully',
      });

      // Reset form
      setFormData({
        name: '',
        category: CATEGORIES[0],
        quantity: '',
        unit: '',
        location: '',
        expiry_date: '',
        description: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add inventory item',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as typeof CATEGORIES[number] }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to your inventory
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Item Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter item name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="unit" className="text-sm font-medium">
                Unit
              </label>
              <Input
                id="unit"
                name="unit"
                placeholder="e.g., pieces, gallons"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Storage Location
              </label>
              <Input
                id="location"
                name="location"
                placeholder="Enter storage location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expiry_date" className="text-sm font-medium">
                Expiry Date
              </label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter item description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 