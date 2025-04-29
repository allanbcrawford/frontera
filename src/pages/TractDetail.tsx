import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { TractChat } from '@/components/tracts/TractChat';
import { AppLayout } from '@/components/layout/AppLayout';

type Tract = Database['public']['Tables']['tracts']['Row'];

export default function TractDetail() {
  const { tractId } = useParams<{ tractId: string }>();
  const [tract, setTract] = useState<Tract | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tractId) {
      loadTractData();
    }
  }, [tractId]);

  const loadTractData = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user logged in');

      // Fetch tract data
      const { data: tractData, error: tractError } = await supabase
        .from('tracts')
        .select('*')
        .eq('id', tractId)
        .single();

      if (tractError) throw tractError;
      if (!tractData) throw new Error('Tract not found');

      setTract(tractData);
    } catch (error) {
      console.error('Error loading tract:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tract details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!tract) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p>Tract not found</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tract.name}`} />
              <AvatarFallback>{tract.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{tract.name}</h1>
                {tract.member_count && tract.member_count > 0 && (
                  <Badge variant="outline" className="ml-2">
                    <Users className="mr-1 h-3 w-3" />
                    {tract.member_count} members
                  </Badge>
                )}
              </div>
              {tract.description && (
                <p className="text-gray-500 mt-2">{tract.description}</p>
              )}
              {tract.tags && tract.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {tract.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <TractChat tractId={tract.id} />
      </div>
    </AppLayout>
  );
}
