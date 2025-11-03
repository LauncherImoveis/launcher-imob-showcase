import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumCheck } from '@/hooks/usePremiumCheck';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Phone, Mail, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { LeadDialog } from '@/components/crm/LeadDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  contact_name: string;
  contact_phone: string | null;
  message: string | null;
  created_at: string;
  property_id: string | null;
  properties?: {
    title: string;
  };
}

export default function Leads() {
  const { isPremium, isLoading: checkingPremium } = usePremiumCheck();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPremium) {
      loadLeads();
    }
  }, [isPremium]);

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
          message,
          created_at,
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

  const handleCreateLead = () => {
    setSelectedLead(null);
    setIsDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh?: boolean) => {
    setIsDialogOpen(false);
    setSelectedLead(null);
    if (shouldRefresh) {
      loadLeads();
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">Gerencie seus contatos e oportunidades</p>
          </div>
          <Button onClick={handleCreateLead}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro lead ou aguarde contatos dos seus imóveis'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateLead}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Lead
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleEditLead(lead)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {lead.contact_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lead.contact_phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {lead.contact_phone}
                    </div>
                  )}
                  {lead.properties && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Interesse: {lead.properties.title}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(lead.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {lead.message && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {lead.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <LeadDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        lead={selectedLead}
      />
    </div>
  );
}
