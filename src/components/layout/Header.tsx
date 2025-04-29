import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { supabase } from "@/lib/supabase";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="font-semibold text-xl tracking-tight text-frontera-700 transition-transform hover:scale-[1.02] mr-6"
          >
            Frontera
          </Link>
        </div>
        
        {isLandingPage ? (
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <AvatarUpload
                        currentUser={{
                          ...user,
                          avatar_url: userData.avatarUrl
                        }}
                        firstName={userData.firstName}
                        size="sm"
                        showUploadButton={false}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userData.firstName
                            ? `${userData.firstName} ${userData.lastName || ''}`
                            : 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/inventory">Inventory</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/tracts">Tracts</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/resources">Resources</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        ) : null}
      </div>
      
      {/* Mobile menu - only shown on landing page */}
      {isLandingPage && isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-card border-b border-border animate-in">
          <nav className="flex flex-col space-y-1 pb-3">
            {user ? (
              <>
                <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/inventory" onClick={() => setIsMenuOpen(false)}>Inventory</MobileNavLink>
                <MobileNavLink to="/tracts" onClick={() => setIsMenuOpen(false)}>Tracts</MobileNavLink>
                <MobileNavLink to="/resources" onClick={() => setIsMenuOpen(false)}>Resources</MobileNavLink>
                <MobileNavLink to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</MobileNavLink>
                <MobileNavLink to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</MobileNavLink>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md text-destructive"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/signin" onClick={() => setIsMenuOpen(false)}>Sign In</MobileNavLink>
                <MobileNavLink to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</MobileNavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-md"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
