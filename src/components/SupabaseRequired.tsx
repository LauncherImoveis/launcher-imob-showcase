import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Shield, Zap, Users } from "lucide-react";

const SupabaseRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent flex items-center justify-center p-4">
      <Card className="max-w-2xl mx-auto shadow-strong">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Conecte ao <span className="text-gradient">Supabase</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Para ativar todas as funcionalidades do Launcher.imóveis, conecte sua conta ao Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
              <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Autenticação Segura</h3>
                <p className="text-sm text-muted-foreground">Login/registro com e-mail e senha</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
              <Database className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Banco de Dados</h3>
                <p className="text-sm text-muted-foreground">Armazenamento seguro dos imóveis</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
              <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Upload de Imagens</h3>
                <p className="text-sm text-muted-foreground">Armazenamento de fotos dos imóveis</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-secondary rounded-lg">
              <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Gerenciamento</h3>
                <p className="text-sm text-muted-foreground">Dashboard completo para corretores</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-light p-6 rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Como conectar:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>1. Clique no botão verde "Supabase" no topo da interface</li>
              <li>2. Siga as instruções para conectar sua conta</li>
              <li>3. Todas as funcionalidades serão ativadas automaticamente</li>
            </ol>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              A integração com Supabase é gratuita e leva apenas alguns minutos para configurar.
            </p>
            
            <div className="space-y-2">
              <Button 
                className="w-full btn-animated bg-gradient-primary hover:bg-primary-hover" 
                onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
              >
                Ver Documentação do Supabase
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/">Voltar ao Início</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseRequired;