import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
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
            <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Informações que Coletamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Coletamos as seguintes informações quando você usa o Launcher.imóveis:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Informações de cadastro:</strong> nome, e-mail, telefone</li>
                <li><strong>Informações de propriedades:</strong> endereços, fotos, descrições</li>
                <li><strong>Dados de uso:</strong> páginas visitadas, tempo de sessão, cliques</li>
                <li><strong>Informações de pagamento:</strong> processadas de forma segura pela Stripe</li>
                <li><strong>Dados técnicos:</strong> endereço IP, navegador, dispositivo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Como Usamos Suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar notificações importantes sobre sua conta</li>
                <li>Responder suas solicitações de suporte</li>
                <li>Analisar o uso da plataforma para melhorias</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Compartilhamos suas informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Provedores de serviço:</strong> Stripe (pagamentos), Supabase (hospedagem de dados)</li>
                <li><strong>Requisitos legais:</strong> quando exigido por lei ou ordem judicial</li>
                <li><strong>Proteção de direitos:</strong> para prevenir fraudes ou proteger nossos direitos</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                <strong>Nunca vendemos seus dados pessoais a terceiros.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Revogar o consentimento</li>
                <li>Portabilidade dos dados</li>
                <li>Informações sobre compartilhamento de dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Segurança de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                seus dados, incluindo:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Criptografia de senhas</li>
                <li>Acesso restrito aos dados pessoais</li>
                <li>Monitoramento de segurança contínuo</li>
                <li>Backups regulares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento da plataforma, como 
                cookies de sessão e autenticação. Não utilizamos cookies de rastreamento 
                ou publicidade de terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pessoais pelo tempo necessário para fornecer nossos serviços 
                e cumprir obrigações legais. Após o cancelamento da conta, seus dados são 
                anonimizados ou excluídos conforme aplicável.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Dados de Menores</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nossos serviços são destinados a maiores de 18 anos. Não coletamos 
                intencionalmente dados de menores de idade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Transferência Internacional de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seus dados são armazenados em servidores seguros. Alguns de nossos provedores 
                de serviço podem estar localizados fora do Brasil, mas garantimos que eles 
                seguem padrões adequados de proteção de dados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre 
                mudanças significativas por e-mail ou através de aviso na plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Contato do Encarregado de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, contate 
                nosso Encarregado de Proteção de Dados:
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                E-mail: 
                <a href="mailto:privacidade@launcher-imoveis.com" className="text-primary hover:underline ml-1">
                  privacidade@launcher-imoveis.com
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

export default Privacy;
