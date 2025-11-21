import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CRMLayout } from '@/components/crm/CRMLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Eye, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  is_active: boolean | null;
  created_at: string | null;
  _count?: {
    leads: number;
  };
}

export default function Imoveis() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar imóveis
      const { data: propertiesData, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propsError) throw propsError;

      // Buscar contagem de leads por imóvel
      const propertiesWithLeads = await Promise.all(
        (propertiesData || []).map(async (property) => {
          const { count } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('property_id', property.id);

          return {
            ...property,
            _count: { leads: count || 0 }
          };
        })
      );

      setProperties(propertiesWithLeads);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CRMLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Imóveis CRM</h1>
            <p className="text-muted-foreground">
              Visão de leads por imóvel
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/new')}>
            <Building2 className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, endereço ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando seus imóveis'}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/dashboard/new')}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Cadastrar Imóvel
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {property.title}
                    </CardTitle>
                    <Badge variant={property.is_active ? "default" : "secondary"}>
                      {property.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(property.price * 100)}
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    {property.address}
                    {property.neighborhood && `, ${property.neighborhood}`}
                  </p>
                  
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    {property.bedrooms && <span>{property.bedrooms} quartos</span>}
                    {property.bathrooms && <span>{property.bathrooms} banheiros</span>}
                    {property.area_m2 && <span>{property.area_m2}m²</span>}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold">
                      {property._count?.leads || 0} leads
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/dashboard/edit/${property.id}`)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast.info('Ver leads deste imóvel - Em desenvolvimento')}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Ver Leads
                    </Button>
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
