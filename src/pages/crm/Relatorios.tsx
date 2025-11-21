import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { StatCard } from '@/components/crm/CRMStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Calendar, FileDown, PieChart 
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, formatPercentage, LEAD_ORIGINS } from '@/lib/formatters';

interface Stats {
  totalLeads: number;
  leadsThisMonth: number;
  activeDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalRevenue: number;
  avgDealValue: number;
  conversionRate: number;
  leadsByOrigin: Record<string, number>;
}

export default function Relatorios() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        leadsData,
        leadsMonthData,
        leadsOriginData,
        activeDealsData,
        wonDealsData,
        lostDealsData,
        transactionsData
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
          .from('leads')
          .select('origin')
          .eq('user_id', user.id),
        supabase
          .from('crm_deals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'open'),
        supabase
          .from('crm_deals')
          .select('value')
          .eq('user_id', user.id)
          .eq('status', 'won'),
        supabase
          .from('crm_deals')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'lost'),
        supabase
          .from('crm_transactions')
          .select('amount, commission_amount')
          .eq('user_id', user.id)
      ]);

      const totalLeads = leadsData.count || 0;
      const leadsThisMonth = leadsMonthData.count || 0;
      const activeDeals = activeDealsData.count || 0;
      const wonDeals = wonDealsData.data?.length || 0;
      const lostDeals = lostDealsData.count || 0;

      const totalRevenue = transactionsData.data?.reduce(
        (sum, t) => sum + (t.commission_amount || t.amount), 0
      ) || 0;

      const totalDealValue = wonDealsData.data?.reduce(
        (sum, d) => sum + (d.value || 0), 0
      ) || 0;

      const avgDealValue = wonDeals > 0 ? totalDealValue / wonDeals : 0;
      const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

      // Contar leads por origem
      const leadsByOrigin: Record<string, number> = {};
      leadsOriginData.data?.forEach(lead => {
        const origin = lead.origin || 'outros';
        leadsByOrigin[origin] = (leadsByOrigin[origin] || 0) + 1;
      });

      setStats({
        totalLeads,
        leadsThisMonth,
        activeDeals,
        wonDeals,
        lostDeals,
        totalRevenue,
        avgDealValue,
        conversionRate,
        leadsByOrigin
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.info(`Exportar para ${format.toUpperCase()} - Em desenvolvimento`);
    // TODO: Implementar exportação
  };

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho das suas vendas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
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
              />

              <StatCard
                title="Negociações Ativas"
                value={stats?.activeDeals || 0}
                subtitle="Em andamento"
                icon={TrendingUp}
              />

              <StatCard
                title="Negócios Fechados"
                value={stats?.wonDeals || 0}
                subtitle={`${stats?.lostDeals || 0} perdidos`}
                icon={BarChart3}
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
              />

              <StatCard
                title="Ticket Médio"
                value={formatCurrency(stats?.avgDealValue || 0)}
                subtitle="Valor médio por venda"
                icon={DollarSign}
              />

              <StatCard
                title="Período"
                value="Todos"
                subtitle="Desde o início"
                icon={Calendar}
              />

              <StatCard
                title="Funil"
                value="Ver"
                subtitle="Análise do funil"
                icon={PieChart}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Leads por Origem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats?.leadsByOrigin || {}).map(([origin, count]) => (
                    <div key={origin} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {LEAD_ORIGINS[origin as keyof typeof LEAD_ORIGINS] || origin}
                      </span>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(stats?.leadsByOrigin || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum lead registrado ainda
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gráficos Detalhados</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Gráficos interativos em desenvolvimento
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </CRMLayout>
  );
}
