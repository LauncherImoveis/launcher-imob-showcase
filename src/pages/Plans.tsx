import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check, Star, Zap, Crown, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Plans = () => {
  const plans = [
    {
      name: "Grátis",
      price: "R$ 0",
      period: "para sempre",
      description: "Perfeito para começar",
      icon: Zap,
      features: [
        "Até 3 imóveis ativos",
        "Portal básico personalizado",
        "Páginas individuais de imóveis",
        "Integração WhatsApp",
        "Upload de fotos",
        "Suporte por email"
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 49",
      period: "/mês",
      description: "Para corretores profissionais",
      icon: Crown,
      features: [
        "Imóveis ilimitados",
        "Logo personalizada",
        "Cores customizadas",
        "Analytics avançado",
        "Relatórios mensais",
        "Suporte prioritário",
        "Integração com Google Maps",
        "Vídeos nos imóveis",
        "SEO otimizado"
      ],
      buttonText: "Começar Teste Grátis",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Créditos",
      price: "A partir de R$ 15",
      period: "por pacote",
      description: "Pague apenas pelo que usar",
      icon: CreditCard,
      features: [
        "Sem mensalidade fixa",
        "Créditos não expiram",
        "1 crédito = 1 imóvel ativo",
        "Pacotes de 3, 5, 10, 20 créditos",
        "Portal personalizado",
        "Integração WhatsApp",
        "Suporte por email"
      ],
      buttonText: "Ver Pacotes",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const creditPackages = [
    { credits: 3, price: 15, pricePerCredit: 5 },
    { credits: 5, price: 22, pricePerCredit: 4.4 },
    { credits: 10, price: 40, pricePerCredit: 4 },
    { credits: 20, price: 70, pricePerCredit: 3.5 }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-light via-white to-accent">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Escolha o plano ideal para <span className="text-gradient">seu negócio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comece grátis e escale conforme suas necessidades. Sem compromisso, sem surpresas.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative text-center ${plan.popular ? 'border-primary shadow-strong scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>Mais Popular</span>
                    </span>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4">
                    <div className={`p-3 rounded-lg w-fit ${plan.popular ? 'bg-gradient-primary' : 'bg-secondary'}`}>
                      <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {plan.price}
                    <span className="text-lg text-muted-foreground font-normal">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-whatsapp flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full btn-animated ${plan.popular ? 'bg-gradient-primary hover:bg-primary-hover' : ''}`}
                    asChild
                  >
                    <Link to="/register">{plan.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Packages Detail */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pacotes de Créditos</h2>
            <p className="text-lg text-muted-foreground">
              Pague apenas pelos imóveis que você quer manter ativos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {creditPackages.map((pkg, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.credits} Créditos</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    R$ {pkg.price}
                  </div>
                  <CardDescription>
                    R$ {pkg.pricePerCredit.toFixed(2)} por crédito
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/register">Comprar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              * Cada crédito permite manter 1 imóvel ativo permanentemente
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Posso mudar de plano a qualquer momento?",
                answer: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. As mudanças são efetivadas imediatamente."
              },
              {
                question: "Como funcionam os créditos?",
                answer: "Cada crédito permite manter 1 imóvel ativo permanentemente. Os créditos não expiram e você pode comprar mais quando precisar."
              },
              {
                question: "O plano Pro tem período de teste?",
                answer: "Sim, oferecemos 14 dias grátis do plano Pro para você testar todos os recursos premium."
              },
              {
                question: "Posso cancelar minha assinatura?",
                answer: "Sim, você pode cancelar a qualquer momento. Não há multas ou taxas de cancelamento."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comece hoje mesmo, grátis!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Crie sua conta e tenha seus primeiros imóveis online em minutos
          </p>
          <Button size="lg" className="btn-animated bg-white text-primary hover:bg-gray-100" asChild>
            <Link to="/register">Criar Conta Grátis</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Plans;