import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { Button } from '../ui/button';
import { Pencil, Trash2, Users } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { useAuth } from '@/contexts/AuthContext';

type Tract = Database['public']['Tables']['tracts']['Row'];

export default function TractsList() {
  const [tracts, setTracts] = useState<Tract[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTracts();
  }, []);

  const loadTracts = async () => {
    try {
      // Fetch tracts
      const { data, error } = await supabase
        .from('tracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracts(data || []);
    } catch (error) {
      console.error('Error loading tracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tracts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTracts(tracts.filter(tract => tract.id !== id));
      toast({
        title: 'Success',
        description: 'Tract deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting tract:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tract',
        variant: 'destructive',
      });
    }
  };

  const getDifficultyBadge = (difficulty: string | null) => {
    if (!difficulty) return null;
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      'Easy': 'default',
      'Medium': 'secondary',
      'Hard': 'destructive'
    };
    return (
      <Badge variant={variants[difficulty] || 'default'}>
        {difficulty}
      </Badge>
    );
  };

  const filteredTracts = tracts.filter(tract => {
    const matchesSearch = 
      tract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tract.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (tract.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (tracts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tracts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search tracts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredTracts.map((tract) => (
          <Link key={tract.id} to={`/tracts/${tract.id}`}>
            <Card className="p-4 hover:bg-accent/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tract.name}`} />
                    <AvatarFallback>{tract.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{tract.name}</h3>
                      {tract.member_count && tract.member_count > 0 && (
                        <Badge variant="outline" className="ml-2">
                          <Users className="mr-1 h-3 w-3" />
                          {tract.member_count} members
                        </Badge>
                      )}
                    </div>
                    {tract.description && (
                      <p className="text-sm text-gray-500 mt-1">{tract.description}</p>
                    )}
                    {tract.tags && tract.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {tract.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {tract.user_id === user?.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement edit
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(tract.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
