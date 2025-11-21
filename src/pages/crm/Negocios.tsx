import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { DealCard } from '@/components/crm/DealCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, TrendingUp, Settings } from 'lucide-react';
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
  status: string | null;
  lead_id: string | null;
  property_id: string | null;
  leads?: {
    contact_name: string | null;
  };
  properties?: {
    title: string;
  };
}

export default function Negocios() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
          .select(`
            id,
            title,
            value,
            stage_id,
            probability,
            expected_close_date,
            status,
            lead_id,
            property_id,
            leads (
              contact_name
            ),
            properties (
              title
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
      ]);

      if (stagesData.error) throw stagesData.error;
      if (dealsData.error) throw dealsData.error;

      setStages(stagesData.data || []);
      setDeals(dealsData.data || []);
    } catch (error) {
      console.error('Erro ao carregar pipeline:', error);
      toast.error('Erro ao carregar pipeline');
    } finally {
      setLoading(false);
    }
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage_id === stageId);
  };

  const handleDealClick = (deal: Deal) => {
    toast.info('Detalhes da negociação - Em desenvolvimento');
    // TODO: Abrir modal com detalhes, timeline, documentos
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    
    try {
      const { error } = await supabase
        .from('crm_deals')
        .update({ stage_id: stageId })
        .eq('id', dealId);

      if (error) throw error;

      toast.success('Negociação movida com sucesso');
      loadData();
    } catch (error) {
      console.error('Erro ao mover negociação:', error);
      toast.error('Erro ao mover negociação');
    }
  };

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pipeline de Negociações</h1>
            <p className="text-muted-foreground">
              Gerencie seus negócios em andamento
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Configurar pipeline - Em desenvolvimento')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurar
            </Button>
            <Button onClick={() => toast.info('Nova negociação - Em desenvolvimento')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Negociação
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : stages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum estágio configurado
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Configure os estágios do seu pipeline para começar
              </p>
              <Button onClick={() => toast.info('Configurar pipeline - Em desenvolvimento')}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar Pipeline
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {stages.map((stage) => (
              <div
                key={stage.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="flex flex-col"
              >
                <Card className="flex flex-col h-full">
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
                  <CardContent className="flex-1 space-y-2 overflow-y-auto max-h-[600px]">
                    {getDealsByStage(stage.id).map((deal) => (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                      >
                        <DealCard
                          deal={deal}
                          onClick={handleDealClick}
                        />
                      </div>
                    ))}
                    {getDealsByStage(stage.id).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma negociação
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>
    </CRMLayout>
  );
}
