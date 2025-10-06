import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Wait a moment for Stripe to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        
        setSubscriptionData(data);

        // Send payment confirmation email
        if (data?.subscribed) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
              await supabase.functions.invoke('send-payment-confirmation', {
                body: { 
                  email: user.email,
                  plan: 'PRO',
                  amount: 'R$ 47,00'
                }
              });
            }
          } catch (emailError) {
            console.error('Error sending payment confirmation:', emailError);
          }
        }
      } catch (error: any) {
        console.error('Error verifying subscription:', error);
      } finally {
        setChecking(false);
      }
    };

    verifySubscription();
  }, []);

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {checking ? (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
              <CardTitle>Verificando assinatura...</CardTitle>
              <CardDescription>Aguarde enquanto confirmamos seu pagamento</CardDescription>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Pagamento confirmado!</CardTitle>
              <CardDescription>
                {subscriptionData?.subscribed 
                  ? "Sua assinatura PRO está ativa"
                  : "Processando sua assinatura..."}
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        {!checking && (
          <CardContent className="space-y-4">
            <div className="bg-secondary p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">Próximos passos:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Você pode cadastrar até 15 imóveis no plano PRO</li>
                <li>Todas as funcionalidades premium estão liberadas</li>
                <li>Você receberá um email de confirmação em breve</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                className="w-full bg-gradient-primary hover:bg-primary-hover"
                onClick={() => navigate("/dashboard")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Ir para o Dashboard
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/dashboard/new">
                  Cadastrar Novo Imóvel
                </Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
