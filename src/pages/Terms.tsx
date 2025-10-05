import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const Terms = () => {
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
            <CardTitle className="text-3xl">Termos de Uso</CardTitle>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o Launcher.imóveis, você concorda com estes Termos de Uso. 
                Se você não concordar com algum termo, não utilize nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Launcher.imóveis é uma plataforma SaaS que permite a corretores de imóveis criar 
                e gerenciar vitrines digitais para seus imóveis. Oferecemos diferentes planos de 
                assinatura com limites variados de propriedades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Conta de Usuário</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Você é responsável por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Todas as atividades realizadas em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Fornecer informações verdadeiras e atualizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Publicar conteúdo ilegal, fraudulento ou enganoso</li>
                <li>Violar direitos de propriedade intelectual de terceiros</li>
                <li>Tentar acessar áreas não autorizadas do sistema</li>
                <li>Usar a plataforma para spam ou phishing</li>
                <li>Interferir no funcionamento do serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Planos e Pagamentos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Os planos são cobrados conforme especificado na página de preços. Você pode 
                cancelar sua assinatura a qualquer momento através do portal de gerenciamento. 
                Não oferecemos reembolsos proporcionais para cancelamentos antecipados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo o conteúdo da plataforma (design, código, marca) é de propriedade exclusiva 
                do Launcher.imóveis. Você mantém todos os direitos sobre o conteúdo que publica 
                (fotos, descrições de imóveis, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O Launcher.imóveis não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Conteúdo publicado pelos usuários</li>
                <li>Transações realizadas fora da plataforma</li>
                <li>Indisponibilidade temporária do serviço</li>
                <li>Perda de dados por falha do usuário</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Modificações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. 
                Notificaremos usuários sobre mudanças significativas por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Rescisão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar sua conta se você violar estes termos. 
                Você pode cancelar sua conta a qualquer momento através das configurações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Lei Aplicável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões sobre estes termos, entre em contato através do e-mail: 
                <a href="mailto:suporte@launcher-imoveis.com" className="text-primary hover:underline ml-1">
                  suporte@launcher-imoveis.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
