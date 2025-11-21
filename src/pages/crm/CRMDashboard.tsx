import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { StatCard } from '@/components/crm/CRMStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Users, TrendingUp, DollarSign, Calendar, 
  Activity, BarChart3, Building2, FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  activeDeals: number;
  wonDeals: number;
  totalRevenue: number;
  estimatedRevenue: number;
  conversionRate: number;
  pendingReminders: number;
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        leadsData,
        leadsMonthData,
        activeDealsData,
        wonDealsData,
        transactionsData,
        estimatedDealsData,
        remindersData
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', firstDayOfMonth),
        supabase
          .from('crm_deals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'open'),
        supabase
          .from('crm_deals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'won'),
        supabase
          .from('crm_transactions')
          .select('amount, commission_amount')
          .eq('user_id', user.id),
        supabase
          .from('crm_deals')
          .select('value, probability')
          .eq('user_id', user.id)
          .eq('status', 'open'),
        supabase
          .from('crm_reminders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_done', false)
          .lte('remind_at', now.toISOString())
      ]);

      const totalLeads = leadsData.count || 0;
      const leadsThisMonth = leadsMonthData.count || 0;
      const activeDeals = activeDealsData.count || 0;
      const wonDeals = wonDealsData.count || 0;
      const pendingReminders = remindersData.count || 0;

      const totalRevenue = transactionsData.data?.reduce(
        (sum, t) => sum + (t.commission_amount || t.amount), 0
      ) || 0;

      const estimatedRevenue = estimatedDealsData.data?.reduce(
        (sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0
      ) || 0;

      const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

      setStats({
        totalLeads,
        leadsThisMonth,
        activeDeals,
        wonDeals,
        totalRevenue,
        estimatedRevenue,
        conversionRate,
        pendingReminders
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Visão Geral do CRM</h1>
          <p className="text-muted-foreground">
            Acompanhe suas métricas e gerencie seu funil de vendas
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard
                title="Total de Leads"
                value={stats?.totalLeads || 0}
                subtitle={`${stats?.leadsThisMonth || 0} neste mês`}
                icon={Users}
                onClick={() => navigate('/crm/leads')}
              />

              <StatCard
                title="Negociações Ativas"
                value={stats?.activeDeals || 0}
                subtitle="Em andamento"
                icon={TrendingUp}
                onClick={() => navigate('/crm/negocios')}
              />

              <StatCard
                title="Negócios Fechados"
                value={stats?.wonDeals || 0}
                subtitle="Total de vendas"
                icon={BarChart3}
                onClick={() => navigate('/crm/negocios')}
              />

              <StatCard
                title="Taxa de Conversão"
                value={formatPercentage(stats?.conversionRate || 0)}
                subtitle="Leads → Vendas"
                icon={TrendingUp}
              />

              <StatCard
                title="Receita Total"
                value={formatCurrency(stats?.totalRevenue || 0)}
                subtitle="Comissões realizadas"
                icon={DollarSign}
                onClick={() => navigate('/crm/relatorios')}
              />

              <StatCard
                title="Receita Estimada"
                value={formatCurrency(stats?.estimatedRevenue || 0)}
                subtitle="Deals em andamento"
                icon={DollarSign}
              />

              <StatCard
                title="Lembretes Pendentes"
                value={stats?.pendingReminders || 0}
                subtitle="Requerem atenção"
                icon={Calendar}
              />

              <StatCard
                title="Últimas Atividades"
                value="Ver"
                subtitle="Histórico completo"
                icon={Activity}
                onClick={() => navigate('/crm/atividades')}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
                  <FileText className="h-8 w-8 mb-2 text-primary" />
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
    </CRMLayout>
  );
}
