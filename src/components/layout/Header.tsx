import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">Launcher</span>
              <span className="text-lg font-semibold text-foreground">.imóveis</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Início</span>
            </Link>
            <Link
              to="/recursos"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Recursos
            </Link>
            <Link
              to="/planos"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Planos
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
              <Link to="/register">Criar Conta</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/recursos"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                to="/planos"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                </Button>
                <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Criar Conta</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;