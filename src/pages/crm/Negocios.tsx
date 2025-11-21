import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Stage {
  id: string;
  name: string;
  color: string | null;
  sort_order: number | null;
}

interface Deal {
  id: string;
  title: string;
  value: number | null;
  stage_id: string | null;
  probability: number | null;
  expected_close_date: string | null;
  created_at: string | null;
}

export default function Negocios() {
  const { isPremium, isLoading: checkingPremium } = usePremiumCheck();
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPremium) {
      loadData();
    }
  }, [isPremium]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [stagesData, dealsData] = await Promise.all([
        supabase
          .from('crm_stages')
          .select('*')
          .eq('user_id', user.id)
          .order('sort_order', { ascending: true }),
        supabase
          .from('crm_deals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (stagesData.error) throw stagesData.error;
      if (dealsData.error) throw dealsData.error;

      setStages(stagesData.data || []);
      setDeals(dealsData.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage_id === stageId);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  if (checkingPremium) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64" />
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pipeline de Negociações</h1>
            <p className="text-muted-foreground">Gerencie seus negócios em andamento</p>
          </div>
          <Button onClick={() => toast.info('Funcionalidade em desenvolvimento')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Negociação
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : stages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum estágio configurado</h3>
              <p className="text-muted-foreground text-center">
                Configure os estágios do seu pipeline em Configurações
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <Card key={stage.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color || '#6B7280' }}
                    />
                    {stage.name}
                    <span className="ml-auto text-muted-foreground text-sm">
                      {getDealsByStage(stage.id).length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  {getDealsByStage(stage.id).map((deal) => (
                    <Card
                      key={deal.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                    >
                      <h4 className="font-semibold text-sm mb-1">{deal.title}</h4>
                      {deal.value && (
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(deal.value)}
                        </p>
                      )}
                      {deal.probability !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Probabilidade: {deal.probability}%
                        </p>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
