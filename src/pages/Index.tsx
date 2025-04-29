import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArrowRight, Shield, Package, Users, BookOpen } from "lucide-react";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <div className="flex-1">
        <main className="container mx-auto px-4 pt-12 md:pt-24 flex flex-col items-center text-center">
          {showAuth ? (
            <div className="w-full max-w-md mx-auto animate-scale-in">
              <AuthForm />
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Be Prepared for What's Next
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your personal emergency readiness dashboard that brings the preparedness community together
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  size="lg" 
                  className="gap-2"
                  asChild
                >
                  <Link to="/signup">
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/tracts">
                    <span>Explore Tracts</span>
                  </Link>
                </Button>
              </div>
              
              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="bg-card p-6 rounded-lg shadow-subtle slide-in-from-bottom" style={{ animationDelay: "0.1s" }}>
                  <div className="h-12 w-12 rounded-full bg-frontera-500/10 flex items-center justify-center text-frontera-600 mb-4 mx-auto">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Tracts</h3>
                  <p className="text-muted-foreground">
                    Connect with dedicated preparedness communities for knowledge sharing and support
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-subtle slide-in-from-bottom" style={{ animationDelay: "0.2s" }}>
                  <div className="h-12 w-12 rounded-full bg-frontera-500/10 flex items-center justify-center text-frontera-600 mb-4 mx-auto">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Inventory</h3>
                  <p className="text-muted-foreground">
                    Track and manage your emergency supplies with expiration alerts and organization tools
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-subtle slide-in-from-bottom" style={{ animationDelay: "0.3s" }}>
                  <div className="h-12 w-12 rounded-full bg-frontera-500/10 flex items-center justify-center text-frontera-600 mb-4 mx-auto">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Resources</h3>
                  <p className="text-muted-foreground">
                    Access and share valuable preparedness guides, checklists, and tutorials
                  </p>
                </div>
              </div>
              
              {/* Trust section */}
              <div className="mt-24 mb-12 flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 text-frontera-600 mb-4">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Trusted by preparedness enthusiasts worldwide</span>
                </div>
                
                <p className="text-muted-foreground max-w-xl">
                  Frontera helps thousands of preparedness-minded individuals stay ready
                  for whatever comes next. Join our community today.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
