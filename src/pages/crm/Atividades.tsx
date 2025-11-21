import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/formatters';

interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string | null;
  payload: any;
}

export default function Atividades() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('crm_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: 'Criou',
      update: 'Atualizou',
      delete: 'Deletou',
      move: 'Moveu',
      complete: 'Completou'
    };
    return labels[action] || action;
  };

  const getResourceLabel = (type: string) => {
    const labels: Record<string, string> = {
      lead: 'Lead',
      deal: 'Negociação',
      interaction: 'Interação',
      reminder: 'Lembrete',
      stage: 'Estágio'
    };
    return labels[type] || type;
  };

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Histórico de Atividades</h1>
          <p className="text-muted-foreground">
            Registro completo de todas as ações no CRM
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma atividade registrada
              </h3>
              <p className="text-muted-foreground text-center">
                As atividades serão registradas automaticamente conforme você usa o CRM
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {getActionLabel(activity.action)}
                        </Badge>
                        <span className="text-sm font-medium">
                          {getResourceLabel(activity.resource_type)}
                        </span>
                      </div>
                      {activity.payload && (
                        <p className="text-sm text-muted-foreground">
                          {JSON.stringify(activity.payload)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(activity.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </CRMLayout>
  );
}
