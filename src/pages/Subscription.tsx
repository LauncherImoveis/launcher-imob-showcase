import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Calendar, ExternalLink, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Profile {
  name: string;
  plan_type: string;
  credits: number;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  plan_type: string;
  created_at: string;
  currency: string;
}

interface SubscriptionData {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    await loadData(user.id);
  };

  const loadData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, plan_type, credits")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load payment history
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

      // Check subscription status
      const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
      if (subError) throw subError;
      setSubscriptionData(subData);

    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
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

  const handleUpgrade = async () => {
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

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) throw error;
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura será cancelada no final do período atual. Você ainda terá acesso aos recursos PRO até lá.",
      });
      
      setShowCancelDialog(false);
      
      // Reload subscription data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadData(user.id);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCanceling(false);
    }
  };

  const getPlanBadge = () => {
    if (profile?.plan_type === 'pro') {
      return <Badge className="bg-gradient-primary text-white">PRO</Badge>;
    }
    return <Badge variant="outline">Grátis</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">Launcher</span>
                <span className="text-lg font-semibold text-foreground">.imóveis</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/login");
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assinatura e Pagamentos</h1>
          <p className="text-muted-foreground">Gerencie sua assinatura e histórico de pagamentos</p>
        </div>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Plano Atual</CardTitle>
                  <CardDescription>Seu plano e benefícios</CardDescription>
                </div>
                {getPlanBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo de Plano</span>
                  <span className="font-semibold">
                    {profile?.plan_type === 'pro' ? 'PRO' : 'Gratuito'}
                  </span>
                </div>

                {subscriptionData?.subscription_end && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próxima Renovação</span>
                    <span className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(subscriptionData.subscription_end)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Limite de Imóveis</span>
                  <span className="font-semibold">
                    {profile?.plan_type === 'pro' ? '15' : '2'} imóveis
                  </span>
                </div>

                {profile?.credits && profile.credits > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Créditos Disponíveis</span>
                    <span className="font-semibold">{profile.credits}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-semibold">Recursos Inclusos:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-whatsapp" />
                    Portal personalizado com seus imóveis
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-whatsapp" />
                    Integração WhatsApp
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-whatsapp" />
                    Upload ilimitado de fotos
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-whatsapp" />
                    Analytics de visualizações e leads
                  </li>
                  {profile?.plan_type === 'pro' && (
                    <>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-whatsapp" />
                        Até 15 imóveis ativos
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-whatsapp" />
                        Suporte prioritário
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                {profile?.plan_type === 'free' ? (
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-primary-hover"
                    asChild
                  >
                    <Link to="/planos">
                      Escolher Plano
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => setShowCancelDialog(true)}
                      variant="destructive"
                      className="flex-1"
                    >
                      Cancelar Assinatura
                    </Button>
                    <Button 
                      onClick={handleManageSubscription}
                      variant="outline"
                      className="flex-1"
                    >
                      Gerenciar no Stripe
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Histórico de Pagamentos
              </CardTitle>
              <CardDescription>
                {payments.length > 0 
                  ? "Suas transações recentes"
                  : "Nenhum pagamento registrado ainda"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          Plano {payment.plan_type === 'pro' ? 'PRO' : payment.plan_type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(payment.created_at)}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">
                          {formatCurrency(Number(payment.amount), payment.currency)}
                        </div>
                        <Badge 
                          variant={payment.status === 'completed' ? 'default' : 'outline'}
                          className={payment.status === 'completed' ? 'bg-whatsapp text-white' : ''}
                        >
                          {payment.status === 'completed' ? 'Pago' : payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma transação registrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura PRO?</AlertDialogTitle>
            <AlertDialogDescription>
              Sua assinatura será cancelada no final do período atual. Você ainda terá acesso
              aos recursos PRO até {subscriptionData?.subscription_end ? formatDate(subscriptionData.subscription_end) : 'o fim do período'}.
              <br /><br />
              Após o cancelamento, sua conta voltará ao plano Gratuito com limite de 2 imóveis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={canceling}>Manter Assinatura</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {canceling ? "Cancelando..." : "Sim, Cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subscription;