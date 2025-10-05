import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">Launcher</span>
              <span className="text-lg font-semibold text-foreground">.imóveis</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Perguntas Frequentes</CardTitle>
            <p className="text-muted-foreground">Encontre respostas para as dúvidas mais comuns</p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  Como funciona o Launcher.imóveis?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  O Launcher.imóveis é uma plataforma que permite criar vitrines digitais para seus imóveis. 
                  Você cadastra suas propriedades, adiciona fotos e informações, e recebe um link único para 
                  compartilhar com seus clientes. É como ter seu próprio site de imóveis em minutos!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Quais são os planos disponíveis?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Oferecemos três planos: <strong>Gratuito</strong> (2 imóveis), <strong>Pro</strong> (15 imóveis por R$ 49,90/mês), 
                  e <strong>Enterprise</strong> (imóveis ilimitados por R$ 99,90/mês). Você pode começar no plano gratuito 
                  e fazer upgrade a qualquer momento.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Como faço para cadastrar um imóvel?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Após fazer login, clique em "Novo Imóvel" no dashboard. Preencha as informações do imóvel 
                  (título, endereço, preço, características), adicione fotos e seu número de WhatsApp para contato. 
                  Pronto! Seu imóvel estará disponível na sua vitrine digital.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Posso adicionar quantas fotos por imóvel?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Você pode adicionar múltiplas fotos para cada imóvel. Recomendamos usar fotos de alta 
                  qualidade para atrair mais interessados. A primeira foto será a capa do imóvel.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Como compartilho meus imóveis?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Cada imóvel tem um link único que você pode compartilhar por WhatsApp, redes sociais ou e-mail. 
                  Além disso, você tem um portal pessoal (launcher-imoveis.com/portal/seu-nome) que lista todos 
                  os seus imóveis ativos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  Como funciona o sistema de leads?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Quando um interessado clica em "Entrar em Contato" em um imóvel, abrimos o WhatsApp com uma 
                  mensagem pré-preenchida para ele. Você também pode ver estatísticas de visualizações e leads 
                  no seu dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  Posso cancelar minha assinatura a qualquer momento?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Você pode cancelar sua assinatura a qualquer momento através da página de Assinatura no menu. 
                  O acesso será mantido até o final do período já pago.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  Meus dados estão seguros?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! Usamos criptografia SSL/TLS e seguimos as melhores práticas de segurança. Todos os pagamentos 
                  são processados pela Stripe, uma das plataformas mais seguras do mundo. Veja nossa{" "}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>{" "}
                  para mais detalhes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left">
                  Preciso de conhecimentos técnicos para usar?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Não! A plataforma foi desenvolvida para ser extremamente simples e intuitiva. Se você sabe usar 
                  WhatsApp e redes sociais, você consegue usar o Launcher.imóveis sem problemas.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left">
                  Posso usar meu próprio domínio?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Atualmente, todos os usuários recebem um subdomínio personalizado (seu-nome.launcher-imoveis.com). 
                  Estamos trabalhando para adicionar suporte a domínios personalizados em breve!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger className="text-left">
                  Como funciona o período de teste?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Você pode começar gratuitamente com o plano Free (2 imóveis) sem precisar de cartão de crédito. 
                  Quando quiser expandir, basta fazer upgrade para Pro ou Enterprise.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12">
                <AccordionTrigger className="text-left">
                  Não encontrei a resposta para minha dúvida. Como entro em contato?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Entre em contato conosco pelo e-mail{" "}
                  <a href="mailto:suporte@launcher-imoveis.com" className="text-primary hover:underline">
                    suporte@launcher-imoveis.com
                  </a>
                  . Respondemos todas as mensagens em até 24 horas!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
