import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Info, Send, PinIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock messages for demonstration
const MOCK_MESSAGES = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=68'
    },
    content: 'Has anyone tried the Berkey water filter system?',
    timestamp: '2023-06-16T10:30:00Z',
    isPinned: false
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    content: "Yes! I've been using it for 2 years now. Excellent for emergency prep and daily use.",
    timestamp: '2023-06-16T10:32:00Z',
    isPinned: false
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    content: "I prefer the Sawyer mini filter for portability. It's part of my bug-out bag.",
    timestamp: '2023-06-16T10:35:00Z',
    isPinned: false
  },
  {
    id: '4',
    user: {
      id: 'u4',
      name: 'Lisa Yamada',
      avatar: 'https://i.pravatar.cc/150?img=25'
    },
    content: "Here's our community guide on water filtration options for different scenarios.",
    timestamp: '2023-06-16T10:41:00Z',
    isPinned: true
  },
];

type Tract = Database['public']['Tables']['tracts']['Row'];
type TractMember = {
  id: string;
  user_id: string;
  role: string;
  user?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export function TractsLayout() {
  const { tractId } = useParams<{ tractId: string }>();
  const [tracts, setTracts] = useState<Tract[]>([]);
  const [selectedTract, setSelectedTract] = useState<Tract | null>(null);
  const [members, setMembers] = useState<TractMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadTracts();
  }, []);

  useEffect(() => {
    if (tracts.length > 0) {
      const initialTract = tractId 
        ? tracts.find(t => t.id === tractId) 
        : tracts[0];
      setSelectedTract(initialTract || null);
      if (initialTract) {
        loadTractMembers(initialTract.id);
      }
    }
  }, [tracts, tractId]);

  const loadTracts = async () => {
    try {
      const { data, error } = await supabase
        .from('tracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add mock member counts to tracts
      const tractsWithMockData = (data || []).map((tract, index) => ({
        ...tract,
        member_count: [12, 8, 23, 5, 15][index % 5] // Mock member counts
      }));
      
      setTracts(tractsWithMockData);
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

  const loadTractMembers = async (tractId: string) => {
    try {
      const { data, error } = await supabase
        .from('tract_members')
        .select(`
          id,
          user_id,
          role,
          user:users (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('tract_id', tractId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tract members',
        variant: 'destructive',
      });
    }
  };

  const handleTractSelect = (tract: Tract) => {
    setSelectedTract(tract);
    loadTractMembers(tract.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTracts(tracts.filter(tract => tract.id !== id));
      if (selectedTract?.id === id) {
        setSelectedTract(tracts[0] || null);
      }
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, we would send the message to the server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
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

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Tracts List - 1/4 width */}
      <div className="col-span-3">
        <Card className="h-full p-4">
          <div className="space-y-4">
            <Input
              placeholder="Search tracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
              {filteredTracts.map((tract) => (
                <div
                  key={tract.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTract?.id === tract.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
                  onClick={() => handleTractSelect(tract)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tract.name}`} />
                        <AvatarFallback>{tract.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{tract.name}</h3>
                        {tract.member_count && tract.member_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="mr-1 h-3 w-3" />
                            {tract.member_count} {tract.member_count === 1 ? 'member' : 'members'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Discussion Panel - 1/2 width */}
      <div className="col-span-6">
        {selectedTract ? (
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedTract.name}`} />
                  <AvatarFallback>{selectedTract.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedTract.name}</h2>
                  {selectedTract.description && (
                    <p className="text-sm text-muted-foreground">{selectedTract.description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              {/* Pinned Messages */}
              {MOCK_MESSAGES.filter(m => m.isPinned).length > 0 && (
                <div className="p-3 bg-secondary/50 m-4 mb-0 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <PinIcon className="h-3 w-3" />
                    <span>Pinned Message</span>
                  </div>
                  
                  {MOCK_MESSAGES.filter(m => m.isPinned).map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.user.avatar} alt={message.user.name} />
                        <AvatarFallback>
                          {message.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{message.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Regular Messages */}
              <div className="p-4 space-y-4">
                {MOCK_MESSAGES.map(message => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.user.avatar} alt={message.user.name} />
                      <AvatarFallback>
                        {message.user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center text-muted-foreground">
            Select a tract to view its discussion
          </Card>
        )}
      </div>

      {/* Members/About Panel - 1/4 width */}
      <div className="col-span-3">
        {selectedTract ? (
          <Card className="h-full">
            <Tabs defaultValue="members" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="about">
                  <Info className="h-4 w-4 mr-2" />
                  About
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="p-4 h-[calc(100%-3rem)] overflow-y-auto">
                <div className="space-y-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {member.user?.avatar_url ? (
                          <AvatarImage src={member.user.avatar_url} alt={`${member.user?.first_name || 'Anonymous'} ${member.user?.last_name || 'User'}`} />
                        ) : (
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.id}`} />
                        )}
                        <AvatarFallback>
                          {member.user ? 
                            `${member.user.first_name?.[0] || ''}${member.user.last_name?.[0] || ''}` :
                            'AU'
                          }
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {member.user ? 
                              `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() || 'Anonymous User' :
                              'Anonymous User'
                            }
                          </span>
                          {member.role !== 'member' && (
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="p-4 h-[calc(100%-3rem)] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTract.description}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {selectedTract.tags && selectedTract.tags.length > 0 && (
                    <>
                      <div>
                        <h3 className="font-medium mb-1">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTract.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  <div>
                    <h3 className="font-medium mb-1">Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedTract.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {selectedTract.user_id === user?.id && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Manage Tract</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement edit
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Tract
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(selectedTract.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Tract
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center text-muted-foreground">
            Select a tract to view its details
          </Card>
        )}
      </div>
    </div>
  );
} 