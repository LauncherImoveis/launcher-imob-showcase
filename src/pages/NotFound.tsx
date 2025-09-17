import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light via-white to-accent">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">Launcher</span>
              <span className="text-xl font-semibold text-foreground">.imóveis</span>
            </div>
          </Link>
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-4 w-4" />
            <span>Voltar ao Início</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
