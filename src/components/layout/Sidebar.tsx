import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  Map,
  BookOpen,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Tracts", href: "/tracts", icon: Map },
  { name: "Resources", href: "/resources", icon: BookOpen },
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name, avatar_url')
            .eq('id', currentUser.id)
            .single();
          
          if (userData) {
            setUserData({
              firstName: userData.first_name || "",
              lastName: userData.last_name || "",
              avatarUrl: userData.avatar_url || "",
            });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Frontera" className="h-6 w-6" />
          <span className="font-semibold">frontera</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sm font-normal"
            >
              <AvatarUpload
                currentUser={{
                  ...user,
                  avatar_url: userData.avatarUrl
                }}
                firstName={userData.firstName}
                size="sm"
                showUploadButton={false}
              />
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {userData.firstName
                    ? `${userData.firstName} ${userData.lastName || ''}`
                    : user?.email}
                </span>
                <span className="text-xs text-muted-foreground">Account</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
