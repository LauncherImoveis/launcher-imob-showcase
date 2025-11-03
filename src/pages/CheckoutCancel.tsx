import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTryAgain = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao processar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Pagamento cancelado</CardTitle>
          <CardDescription>
            Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Se você encontrou algum problema durante o checkout ou tem dúvidas sobre os planos, 
              entre em contato conosco pelo WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-gradient-primary hover:bg-primary-hover"
              onClick={() => navigate("/planos")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Escolher Plano
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate("/planos")}
            >
              Ver Planos
            </Button>

            <Button 
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutCancel;
