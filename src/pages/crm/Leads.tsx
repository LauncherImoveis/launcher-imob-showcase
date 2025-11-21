import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { LeadCard } from '@/components/crm/LeadCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, User, FileDown, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { LEAD_ORIGINS, LEAD_STATUS } from '@/lib/formatters';

interface Lead {
  id: string;
  contact_name: string | null;
  contact_phone: string | null;
  email: string | null;
  origin: string | null;
  status: string | null;
  message: string | null;
  created_at: string | null;
  last_contact_at: string | null;
  property_id: string | null;
  properties?: {
    title: string;
  };
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          contact_name,
          contact_phone,
          email,
          origin,
          status,
          message,
          created_at,
          last_contact_at,
          property_id,
          properties (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    toast.info('Detalhes do lead - Em desenvolvimento');
    // TODO: Abrir modal ou navegar para detalhes
  };

  const handleImportCSV = () => {
    toast.info('Importação CSV - Em desenvolvimento');
    // TODO: Implementar importação CSV
  };

  const handleExport = () => {
    toast.info('Exportação - Em desenvolvimento');
    // TODO: Implementar exportação
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrigin = originFilter === 'all' || lead.origin === originFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesOrigin && matchesStatus;
  });

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Gerencie seus contatos e oportunidades
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportCSV}>
              <FileUp className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => toast.info('Novo lead - Em desenvolvimento')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              {Object.entries(LEAD_ORIGINS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(LEAD_STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || originFilter !== 'all' || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro lead ou aguarde contatos dos seus imóveis'}
              </p>
              {!searchTerm && originFilter === 'all' && statusFilter === 'all' && (
                <Button onClick={() => toast.info('Novo lead - Em desenvolvimento')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Lead
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={handleLeadClick}
              />
            ))}
          </div>
        )}
      </main>
    </CRMLayout>
  );
}
