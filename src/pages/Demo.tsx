import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Portal de Demonstração</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold">
              Veja o <span className="text-gradient">Launcher.imóveis</span><br />
              em Ação
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore um portal real de corretor e veja como seus imóveis ficarão incríveis
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="btn-animated bg-gradient-primary hover:bg-primary-hover text-lg px-8 py-6"
                onClick={() => window.open('/portal/launcherimoveis', '_blank')}
              >
                Abrir Portal Demo
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                asChild
              >
                <Link to="/register">
                  Criar Meu Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 shadow-strong">
              <div className="aspect-video rounded-xl overflow-hidden shadow-strong border-4 border-white bg-white">
                <iframe
                  src="/portal/launcherimoveis"
                  className="w-full h-full"
                  title="Portal Demo"
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Design Profissional",
                  description: "Layout moderno e responsivo que funciona em todos os dispositivos"
                },
                {
                  title: "Integração WhatsApp",
                  description: "Botões estratégicos para converter visitantes em leads"
                },
                {
                  title: "Fácil de Navegar",
                  description: "Interface intuitiva que facilita a jornada do cliente"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 bg-card rounded-xl border-2 border-border">
                  <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O Que Você Ganha?</h2>
              <p className="text-muted-foreground text-lg">
                Seu portal será assim, mas personalizado com seus imóveis e sua marca
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "✓ URL exclusiva com seu nome",
                "✓ Upload ilimitado de fotos",
                "✓ Botões de WhatsApp personalizados",
                "✓ Edição e gerenciamento fácil",
                "✓ Analytics de visualizações",
                "✓ SEO otimizado para Google",
                "✓ Compartilhamento social",
                "✓ Suporte dedicado"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-hero text-white rounded-3xl p-12 shadow-strong">
            <h2 className="text-3xl font-bold mb-4">
              Gostou do que viu?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Crie seu portal profissional em minutos e comece a vender mais
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
            <p className="text-sm mt-6 opacity-75">
              ✓ Grátis para até 2 imóveis • ✓ Sem cartão de crédito • ✓ Setup em 5 minutos
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;