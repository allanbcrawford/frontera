import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Bell, Mail, MapPin, Shield, Trophy, Award, Star, Target, Zap } from "lucide-react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [location, setLocation] = useState("");
  const [notifications, setNotifications] = useState(user?.user_metadata?.notifications || true);
  const [privacy, setPrivacy] = useState(user?.user_metadata?.privacy || "public");

  // Load user profile data from database
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('username, first_name, last_name, location')
            .eq('id', currentUser.id)
            .single();
          
          if (userData) {
            setUsername(userData.username || "");
            setFirstName(userData.first_name || "");
            setLastName(userData.last_name || "");
            setLocation(userData.location || "");
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      await updateUserProfile({
        first_name: firstName,
        last_name: lastName,
        username: username,
        location: location,
        full_name: `${firstName} ${lastName}`.trim(),
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
            type={isEditing ? "submit" : "button"}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{`${firstName} ${lastName}`.trim() || 'Profile Information'}</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-6">
                  <AvatarUpload
                    currentUser={user}
                    firstName={firstName}
                    size="lg"
                    onUploadComplete={(url) => {
                      // Update the user's avatar URL in the database
                      updateUserProfile({
                        avatar_url: url,
                        updated_at: new Date().toISOString()
                      });
                    }}
                  />
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your location"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your account and community
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={notifications ? "default" : "outline"}
                      onClick={() => setNotifications(!notifications)}
                      disabled={!isEditing}
                    >
                      {notifications ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Privacy Settings</Label>
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile and activity
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={privacy === "public" ? "default" : "secondary"}>
                        {privacy === "public" ? "Public" : "Private"}
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setPrivacy(privacy === "public" ? "private" : "public")}
                        disabled={!isEditing}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Account Status Section */}
              <div className="mt-8 pt-8 border-t space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-frontera-500/10 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-frontera-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-muted-foreground">January 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-frontera-500/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-frontera-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email verified</p>
                    <p className="text-sm text-muted-foreground">Yes</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preparedness Score */}
          <Card>
            <CardHeader>
              <CardTitle>Preparedness Score</CardTitle>
              <CardDescription>
                Track your progress and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Level Progress */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-2xl font-bold">Level 2</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  75 / 100 points to next level
                </p>
                <Progress value={75} className="h-2" />
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
                  <Award className="h-5 w-5 mx-auto text-frontera-600" />
                  <p className="text-2xl font-bold">75</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="space-y-1 text-center p-4 rounded-lg bg-muted/50">
                  <Trophy className="h-5 w-5 mx-auto text-yellow-500" />
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>

              {/* Achievements List */}
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    id: "inventory-master",
                    title: "Inventory Master",
                    description: "Maintain a well-organized inventory with at least 50 items",
                    icon: <Shield className="h-5 w-5" />,
                    progress: 84,
                    completed: true,
                    points: 20,
                  },
                  {
                    id: "community-leader",
                    title: "Community Leader",
                    description: "Create and manage an active tract with 100+ members",
                    icon: <Star className="h-5 w-5" />,
                    progress: 64,
                    completed: false,
                    points: 25,
                  },
                  {
                    id: "knowledge-seeker",
                    title: "Knowledge Seeker",
                    description: "Bookmark and complete 10 resource guides",
                    icon: <Target className="h-5 w-5" />,
                    progress: 40,
                    completed: false,
                    points: 15,
                  },
                  {
                    id: "first-responder",
                    title: "First Responder",
                    description: "Complete all medical preparedness resources",
                    icon: <Zap className="h-5 w-5" />,
                    progress: 90,
                    completed: true,
                    points: 30,
                  },
                ].map((achievement) => (
                  <AccordionItem key={achievement.id} value={achievement.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          achievement.completed ? "bg-frontera-500/10 text-frontera-600" : "bg-muted text-muted-foreground"
                        )}>
                          {achievement.icon}
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{achievement.title}</span>
                            {achievement.completed && (
                              <Badge variant="secondary" className="text-[10px]">
                                +{achievement.points} pts
                              </Badge>
                            )}
                          </div>
                          <Progress 
                            value={achievement.progress} 
                            className="h-1 w-24"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-12 pt-2">
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs text-muted-foreground">
                            Progress: {achievement.progress}%
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
