
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto py-6 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-semibold text-lg text-frontera-700">
              Frontera
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Emergency Preparedness at your fingertips
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center md:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Frontera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
