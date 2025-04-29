import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Users, Info, PinIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Keep mock messages for now until we implement real-time chat
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

interface TractData {
  id: string;
  name: string;
  description: string | null;
  member_count: number | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  location: string | null;
  size: string | null;
  tags: string[] | null;
}

interface TractMember {
  id: string;
  user_id: string;
  role: string;
  user: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export function TractChat({ tractId }: { tractId?: string }) {
  const [messages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [tract, setTract] = useState<TractData | null>(null);
  const [members, setMembers] = useState<TractMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTractData = async () => {
      try {
        if (!tractId) return;

        console.log('Loading tract with ID:', tractId); // Debug log

        // Fetch tract data
        const { data: tractData, error: tractError } = await supabase
          .from('tracts')
          .select(`
            id,
            name,
            description,
            member_count,
            created_at,
            updated_at,
            user_id,
            location,
            size,
            tags
          `)
          .eq('id', tractId)
          .single();

        if (tractError) {
          console.error('Error fetching tract:', tractError); // Debug log
          throw tractError;
        }

        console.log('Tract data:', tractData); // Debug log

        // Fetch tract members with user data
        const { data: membersData, error: membersError } = await supabase
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

        if (membersError) {
          console.error('Error fetching members:', membersError); // Debug log
          throw membersError;
        }

        console.log('Members data:', membersData); // Debug log

        setTract(tractData);
        setMembers(membersData || []);
      } catch (error) {
        console.error('Error loading tract data:', error);
        toast({
          title: "Error",
          description: "Failed to load tract data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTractData();
  }, [tractId, toast]);

  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, we would send the message to the server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!tract) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Tract not found</p>
      </div>
    );
  }
  
  return (
    <div className="animate-in h-full">
      <div className="md:grid md:grid-cols-4 gap-6 h-full">
        <div className="col-span-3">
          <Card className="frosted-glass h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{tract.name}</CardTitle>
                  <CardDescription>
                    {tract.member_count} members
                  </CardDescription>
                </div>
                
                <Badge className="bg-frontera-500 hover:bg-frontera-600">
                  Joined
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
              {/* Pinned Messages */}
              {messages.filter(m => m.isPinned).length > 0 && (
                <div className="p-3 bg-secondary/50 m-4 mb-0 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <PinIcon className="h-3 w-3" />
                    <span>Pinned Message</span>
                  </div>
                  
                  {messages.filter(m => m.isPinned).map(message => (
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
                {messages.map(message => (
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
            </CardContent>
            
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
        </div>
        
        <div className="hidden md:block">
          <Card className="frosted-glass h-full">
            <Tabs defaultValue="members">
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
              
              <TabsContent value="members" className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
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
              
              <TabsContent value="about" className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">About</h3>
                    <p className="text-sm text-muted-foreground">
                      {tract.description}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {tract.tags && tract.tags.length > 0 && (
                    <>
                      <div>
                        <h3 className="font-medium mb-1">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {tract.tags.map((tag, index) => (
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
                      {new Date(tract.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
