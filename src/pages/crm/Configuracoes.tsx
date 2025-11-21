import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

interface CRMSettings {
  commission_default_pct: number;
  notification_email: boolean;
  notification_in_app: boolean;
}

export default function Configuracoes() {
  const [settings, setSettings] = useState<CRMSettings>({
    commission_default_pct: 5.0,
    notification_email: true,
    notification_in_app: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('crm_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          commission_default_pct: data.commission_default_pct || 5.0,
          notification_email: data.notification_email ?? true,
          notification_in_app: data.notification_in_app ?? true
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('crm_settings')
        .upsert({
          user_id: user.id,
          commission_default_pct: settings.commission_default_pct,
          notification_email: settings.notification_email,
          notification_in_app: settings.notification_in_app
        });

      if (error) throw error;

      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Configurações do CRM</h1>
          <p className="text-muted-foreground">
            Personalize suas preferências e configurações
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Comissões</CardTitle>
                <CardDescription>
                  Configure a porcentagem padrão de comissão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commission">Comissão Padrão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={settings.commission_default_pct}
                    onChange={(e) => setSettings({
                      ...settings,
                      commission_default_pct: parseFloat(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Será aplicada automaticamente em novas negociações
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Escolha como deseja receber lembretes e alertas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Notificações por E-mail
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes e alertas no seu e-mail
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notification_email}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notification_email: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notifications">
                      Notificações no App
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações dentro da plataforma
                    </p>
                  </div>
                  <Switch
                    id="app-notifications"
                    checked={settings.notification_in_app}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notification_in_app: checked
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline e Estágios</CardTitle>
                <CardDescription>
                  Gerencie os estágios do seu pipeline de vendas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Gerenciar estágios - Em desenvolvimento')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Gerenciar Estágios
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </CRMLayout>
  );
}
