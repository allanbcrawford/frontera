import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getResourcesList } from '@/lib/api';
import { Resource } from '@/lib/supabase';
import { useToast } from '../ui/use-toast';
import { cn } from '@/lib/utils';

interface ResourcesListProps {
  onResourceSelect: (resource: Resource) => void;
  selectedResourceId: string | null;
}

export default function ResourcesList({ onResourceSelect, selectedResourceId }: ResourcesListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await getResourcesList();
      setResources(data);
      // Select the first resource by default if none is selected
      if (data.length > 0 && !selectedResourceId) {
        onResourceSelect(data[0]);
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (resource.author?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = Array.from(new Set(resources.map(resource => resource.type)));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="max-w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type || 'uncategorized'}>
                  {type || 'Uncategorized'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredResources.map((resource) => (
            <Card 
              key={resource.id}
              className={cn(
                "cursor-pointer transition-colors",
                selectedResourceId === resource.id && "bg-accent"
              )}
              onClick={() => onResourceSelect(resource)}
            >
              <CardContent className="flex items-start justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <span className="text-sm text-gray-500">{resource.type || 'Uncategorized'}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resource.description || 'No description available.'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>By {resource.author || 'Unknown'}</span>
                    <span>Category: {resource.category || 'Uncategorized'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredResources.length === 0 && (
            <p className="text-center text-gray-500">No resources found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
