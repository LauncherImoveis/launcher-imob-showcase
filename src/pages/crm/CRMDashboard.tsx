import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Calendar, Building2, Tag, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  activeDeals: number;
  conversionRate: number;
  estimatedRevenue: number;
  pendingReminders: number;
}

export default function CRMDashboard() {
  const { isPremium, isLoading: premiumLoading } = usePremiumCheck();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPremium) {
      loadDashboardData();
    }
  }, [isPremium]);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total leads
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Leads this month
      const { count: leadsThisMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      // Active deals
      const { count: activeDeals } = await supabase
        .from('crm_deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'open');

      // Won deals for conversion
      const { count: wonDeals } = await supabase
        .from('crm_deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'won');

      // Estimated revenue from active deals
      const { data: deals } = await supabase
        .from('crm_deals')
        .select('value, probability')
        .eq('user_id', user.id)
        .eq('status', 'open');

      const estimatedRevenue = deals?.reduce((sum, deal) => 
        sum + (deal.value || 0) * (deal.probability || 0) / 100, 0
      ) || 0;

      // Pending reminders
      const { count: pendingReminders } = await supabase
        .from('crm_reminders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_done', false)
        .lte('remind_at', new Date().toISOString());

      const conversionRate = totalLeads && wonDeals 
        ? ((wonDeals / totalLeads) * 100) 
        : 0;

      setStats({
        totalLeads: totalLeads || 0,
        leadsThisMonth: leadsThisMonth || 0,
        activeDeals: activeDeals || 0,
        conversionRate: Math.round(conversionRate * 10) / 10,
        estimatedRevenue: estimatedRevenue / 100, // Convert from cents
        pendingReminders: pendingReminders || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (premiumLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isPremium) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads, negociações e acompanhe suas métricas
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.leadsThisMonth} este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Negociações Ativas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeDeals}</div>
                  <p className="text-xs text-muted-foreground">
                    Em andamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Leads convertidos em vendas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {stats?.estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    De negociações ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lembretes Pendentes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.pendingReminders}</div>
                  <p className="text-xs text-muted-foreground">
                    Requerem atenção
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/crm/atividades')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Últimas Atividades</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Ver</div>
                  <p className="text-xs text-muted-foreground">
                    Histórico completo
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Leads</CardTitle>
                  <CardDescription>Gerencie seus contatos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/crm/leads')} className="w-full">
                    Acessar Leads
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Negociações</CardTitle>
                  <CardDescription>Pipeline visual</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/crm/negocios')} className="w-full">
                    Ver Pipeline
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Building2 className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Imóveis</CardTitle>
                  <CardDescription>Leads por imóvel</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/crm/imoveis')} className="w-full">
                    Ver Imóveis
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <DollarSign className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>Análises e exportação</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/crm/relatorios')} className="w-full">
                    Ver Relatórios
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
