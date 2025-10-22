import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmailTest = () => {
  const [email, setEmail] = useState("");
  const [emailType, setEmailType] = useState<'welcome' | 'lead' | 'payment'>('welcome');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const testEmail = async () => {
    if (!email) {
      toast({ title: "Erro", description: "Digite um email válido", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: { email, type: emailType }
      });

      if (error) throw error;

      setResult({ 
        success: true, 
        message: `Email de teste (${emailType}) enviado com sucesso para ${email}!` 
      });
      
      toast({ 
        title: "✅ Sucesso!", 
        description: "Email de teste enviado. Verifique sua caixa de entrada.",
      });
    } catch (error: any) {
      console.error('Error testing email:', error);
      setResult({ 
        success: false, 
        message: error.message || 'Erro ao enviar email de teste. Verifique se o RESEND_API_KEY está configurado.'
      });
      
      toast({ 
        title: "❌ Erro", 
        description: error.message || "Falha ao enviar email de teste",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-accent/20 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-strong">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Testar E-mails Transacionais</CardTitle>
                <CardDescription>
                  Valide se a integração com Resend está funcionando corretamente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>⚠️ Importante:</strong> Certifique-se de que:
              </p>
              <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                <li>O RESEND_API_KEY está configurado no Supabase</li>
                <li>Seu domínio está verificado no Resend (ou use onboarding@resend.dev para testes)</li>
                <li>Você está autenticado no sistema</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail para Teste</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailType">Tipo de E-mail</Label>
                <Select value={emailType} onValueChange={(value: any) => setEmailType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">
                      🎉 Email de Boas-vindas
                    </SelectItem>
                    <SelectItem value="lead">
                      🔔 Notificação de Lead
                    </SelectItem>
                    <SelectItem value="payment">
                      ✅ Confirmação de Pagamento
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={testEmail} 
                disabled={loading || !email}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar E-mail de Teste
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      result.success 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.success ? 'Sucesso!' : 'Erro'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      result.success 
                        ? 'text-green-700 dark:text-green-300' 
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Próximos Passos:</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Verifique sua caixa de entrada (e spam) para o email de teste</li>
                <li>Se receber, a integração está funcionando! ✅</li>
                <li>Se não receber, verifique os logs da edge function</li>
                <li>Atualize o domínio "onboarding@resend.dev" para seu domínio verificado</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTest;
