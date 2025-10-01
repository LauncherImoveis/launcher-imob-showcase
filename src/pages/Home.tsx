import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Building2, 
  Globe, 
  Smartphone, 
  Zap, 
  Shield, 
  TrendingUp,
  Check,
  ArrowRight,
  Star,
  Users,
  Camera,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-light via-white to-accent">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gradient">Vitrines digitais</span><br />
                  profissionais para<br />
                  <span className="text-primary">corretores</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Crie portais exclusivos para seus imóveis, gere leads qualificados 
                  e feche mais vendas com nossa plataforma completa.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="btn-animated bg-gradient-primary hover:bg-primary-hover text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/register">
                    Começar Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/demo">Ver Demo</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Grátis até 2 imóveis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Setup em 5 minutos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-strong transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-xl shadow-medium overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary to-primary-hover"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Casa Moderna em Copacabana</h3>
                    <p className="text-muted-foreground mb-4">3 quartos • 2 banheiros • 120m²</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">R$ 850.000</span>
                      <Button size="sm" className="bg-whatsapp hover:bg-whatsapp-hover">
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tudo que você precisa para <span className="text-gradient">vender mais</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos profissionais que transformam a forma como você apresenta seus imóveis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Portal Exclusivo",
                description: "Cada corretor tem sua URL única com todos os imóveis organizados profissionalmente"
              },
              {
                icon: Smartphone,
                title: "100% Responsivo",
                description: "Perfeito em qualquer dispositivo - desktop, tablet ou smartphone"
              },
              {
                icon: Camera,
                title: "Galeria Profissional",
                description: "Upload múltiplo de fotos com carrossel automático e zoom"
              },
              {
                icon: Share2,
                title: "Compartilhamento Fácil",
                description: "Links únicos para cada imóvel, perfeito para redes sociais"
              },
              {
                icon: Zap,
                title: "Integração WhatsApp",
                description: "Botão direto com mensagem pré-formatada para cada imóvel"
              },
              {
                icon: Shield,
                title: "Sempre Online",
                description: "Hospedagem segura e rápida, seus imóveis sempre acessíveis"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-medium transition-shadow duration-300">
                <div className="mb-4">
                  <div className="p-3 bg-gradient-primary rounded-lg w-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section Preview */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Planos que <span className="text-gradient">crescem com você</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece grátis e escale conforme sua necessidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 text-center relative">
              <h3 className="text-2xl font-bold mb-4">Grátis</h3>
              <div className="text-4xl font-bold text-primary mb-6">R$ 0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Até 2 imóveis</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Portal básico</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>WhatsApp integrado</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/register">Começar Grátis</Link>
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 text-center relative border-primary shadow-medium scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Mais Popular</span>
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">PRO</h3>
              <div className="text-4xl font-bold text-primary mb-6">
                R$ 37<span className="text-lg text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Até 15 imóveis</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>Portal básico</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <Check className="h-4 w-4 text-whatsapp" />
                  <span>WhatsApp integrado</span>
                </li>
              </ul>
              <Button className="w-full btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
                <Link to="/planos">Assinar Plano PRO</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para turbinar suas vendas?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a centenas de corretores que já aumentaram suas vendas com o Launcher.imóveis
          </p>
          <Button 
            size="lg" 
            className="btn-animated bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
            asChild
          >
            <Link to="/register">
              Criar Minha Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;