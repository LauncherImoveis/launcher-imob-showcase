import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Globe, 
  Smartphone, 
  Camera,
  Share2,
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Palette,
  Link as LinkIcon,
  MessageSquare,
  Lock,
  Sparkles,
  Video,
  MapPin,
  Clock,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">
              <span className="text-gradient">Recursos Completos</span><br />
              para Vender Mais
            </h1>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para criar uma presença digital profissional e gerar mais leads
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Globe,
                title: "Portal Exclusivo Personalizado",
                description: "Tenha sua própria URL exclusiva (ex: launcher-imoveis.com/seu-nome) com todos os seus imóveis organizados de forma profissional e fácil de navegar."
              },
              {
                icon: Smartphone,
                title: "Design 100% Responsivo",
                description: "Seus imóveis ficam perfeitos em qualquer tela - desktop, tablet ou celular. Design moderno que converte visitantes em leads."
              },
              {
                icon: Camera,
                title: "Galeria Profissional de Fotos",
                description: "Upload múltiplo de imagens com carrossel automático, zoom de alta qualidade e organização inteligente das fotos dos seus imóveis."
              },
              {
                icon: Share2,
                title: "Links Únicos para Compartilhar",
                description: "Cada imóvel tem sua própria URL para compartilhar no Instagram, Facebook, WhatsApp ou qualquer rede social. Acompanhe os cliques!"
              },
              {
                icon: Zap,
                title: "Integração Direta com WhatsApp",
                description: "Botões estratégicos que direcionam o cliente diretamente para o WhatsApp com mensagem pré-formatada do imóvel específico."
              },
              {
                icon: Shield,
                title: "Hospedagem Segura e Rápida",
                description: "Infraestrutura de alta performance. Seus imóveis sempre online, carregando rapidamente, com segurança SSL e backups automáticos."
              },
              {
                icon: BarChart3,
                title: "Dashboard com Analytics",
                description: "Acompanhe visualizações de cada imóvel, cliques no WhatsApp, leads gerados e tome decisões baseadas em dados reais."
              },
              {
                icon: Video,
                title: "Suporte para Vídeos",
                description: "Integre vídeos do YouTube ou outros players para mostrar tours virtuais e destacar os melhores ângulos dos imóveis."
              },
              {
                icon: MapPin,
                title: "Informações Detalhadas",
                description: "Cadastre todas as informações importantes: localização, quartos, banheiros, área, vagas, descrição completa e muito mais."
              },
              {
                icon: Palette,
                title: "Personalização Visual",
                description: "Personalize cores, logo e visual do seu portal para combinar com sua marca pessoal ou imobiliária."
              },
              {
                icon: MessageSquare,
                title: "Captura de Leads",
                description: "Formulários de contato integrados que capturam informações dos interessados e enviam notificações instantâneas."
              },
              {
                icon: Lock,
                title: "Controle Total",
                description: "Ative ou desative imóveis a qualquer momento. Edite informações, atualize fotos e gerencie tudo em um só lugar."
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="p-3 bg-gradient-primary rounded-lg w-fit group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Benefits */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-12 mb-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex p-3 bg-gradient-primary rounded-xl mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Benefícios Exclusivos</h2>
                <p className="text-muted-foreground text-lg">
                  Vantagens que só o Launcher.imóveis oferece
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Setup rápido em apenas 5 minutos",
                  "Sem necessidade de conhecimento técnico",
                  "Atualizações automáticas e gratuitas",
                  "Suporte dedicado via WhatsApp",
                  "SEO otimizado para aparecer no Google",
                  "Sem anúncios ou marcas de terceiros",
                  "Exportação de dados e relatórios",
                  "Compatível com todos os navegadores"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-1 bg-whatsapp/10 rounded-full">
                        <Check className="h-5 w-5 text-whatsapp" />
                      </div>
                    </div>
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Como Funciona?</h2>
              <p className="text-muted-foreground text-lg">
                Processo simples em 3 passos
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Crie sua Conta",
                  description: "Cadastre-se gratuitamente e tenha acesso ao dashboard em segundos"
                },
                {
                  step: "2",
                  title: "Cadastre seus Imóveis",
                  description: "Adicione fotos, descrições e informações dos imóveis de forma rápida"
                },
                {
                  step: "3",
                  title: "Compartilhe e Venda",
                  description: "Divulgue seu portal exclusivo e comece a receber leads qualificados"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl font-bold mb-4 shadow-strong">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-hero text-white rounded-3xl p-12 shadow-strong">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">
                Pronto para Começar?
              </h2>
              <p className="text-xl opacity-90">
                Crie sua conta gratuita agora e comece a vender mais hoje mesmo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-animated bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/register">Começar Grátis Agora</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/planos">Ver Planos</Link>
                </Button>
              </div>
              <p className="text-sm opacity-75">
                ✓ Sem cartão de crédito • ✓ Setup em 5 minutos • ✓ Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;