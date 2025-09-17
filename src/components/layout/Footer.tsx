import { Building2, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">Launcher</span>
                <span className="text-lg font-semibold text-foreground">.imóveis</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A plataforma definitiva para corretores de imóveis criarem vitrines digitais
              profissionais e expandirem seus negócios online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/recursos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  to="/planos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  to="/suporte"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/termos"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidade"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Launcher.imóveis. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm flex items-center mt-2 md:mt-0">
            Feito com <Heart className="h-4 w-4 mx-1 text-red-500" /> para corretores.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;