import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Eye, Edit, Trash2, ExternalLink, Users, TrendingUp, MapPin, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  address: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  slug: string;
  views?: number;
  leads?: number;
}

interface Profile {
  name: string;
  plan_type: string;
  credits: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [metrics, setMetrics] = useState({
    activeProperties: 0,
    views: 0,
    leads: 0,
    conversion: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    loadDashboardData(user.id);
  };

  const loadDashboardData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, plan_type, credits")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (propertiesError) throw propertiesError;

      // Load metrics for each property
      const propertiesWithMetrics = await Promise.all(
        (propertiesData || []).map(async (property) => {
          // Count views
          const { count: viewsCount } = await supabase
            .from("property_views")
            .select("*", { count: "exact", head: true })
            .eq("property_id", property.id);

          // Count leads
          const { count: leadsCount } = await supabase
            .from("leads")
            .select("*", { count: "exact", head: true })
            .eq("property_id", property.id);

          return {
            ...property,
            views: viewsCount || 0,
            leads: leadsCount || 0,
          };
        })
      );

      setProperties(propertiesWithMetrics);

      // Calculate overall metrics
      const activeCount = propertiesData?.filter(p => p.is_active).length || 0;
      
      // Get views from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: totalViews } = await supabase
        .from("property_views")
        .select("*", { count: "exact", head: true })
        .in("property_id", propertiesData?.map(p => p.id) || [])
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const conversion = totalViews && totalViews > 0 
        ? ((totalLeads || 0) / totalViews) * 100 
        : 0;

      setMetrics({
        activeProperties: activeCount,
        views: totalViews || 0,
        leads: totalLeads || 0,
        conversion: conversion,
      });
    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    try {
      const { error } = await supabase
        .from("properties")
        .update({ is_active: false })
        .eq("id", propertyId);

      if (error) throw error;

      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi desativado com sucesso.",
      });

      // Reload data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) loadDashboardData(user.id);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPlanLimit = () => {
    if (!profile) return 2;
    if (profile.plan_type === "free") return 2;
    if (profile.plan_type === "pro") return 15;
    return profile.credits;
  };

  const getPlanLabel = () => {
    if (!profile) return "Grátis";
    if (profile.plan_type === "free") return `Grátis (${metrics.activeProperties}/${getPlanLimit()} imóveis)`;
    if (profile.plan_type === "pro") return `Pro (${metrics.activeProperties}/15 imóveis)`;
    return `Créditos (${profile.credits} disponíveis)`;
  };

  const isNearLimit = () => {
    if (!profile || profile.plan_type === "credits") return false;
    const limit = getPlanLimit();
    return metrics.activeProperties >= limit - 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">Launcher</span>
                <span className="text-lg font-semibold text-foreground">.imóveis</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Plano: {getPlanLabel()}</span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/planos">Upgrade</Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/login");
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Plan Limit Warning */}
        {isNearLimit() && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção: Limite de imóveis</AlertTitle>
            <AlertDescription>
              Você está usando {metrics.activeProperties} de {getPlanLimit()} imóveis disponíveis no seu plano {profile?.plan_type === 'free' ? 'gratuito' : 'Pro'}. 
              {profile?.plan_type === 'free' && (
                <> <Link to="/planos" className="underline font-medium">Faça upgrade</Link> para adicionar mais imóveis.</>
              )}
              {profile?.plan_type === 'pro' && " Você atingirá o limite em breve."}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis Ativos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeProperties}</div>
              <p className="text-xs text-muted-foreground">
                {profile?.plan_type === "free" ? `de ${getPlanLimit()} disponíveis` : "imóveis ativos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.views}</div>
              <p className="text-xs text-muted-foreground">últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.leads}</div>
              <p className="text-xs text-muted-foreground">contatos WhatsApp</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversion.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">views para leads</p>
            </CardContent>
          </Card>
        </div>

        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meus Imóveis</h1>
            <p className="text-muted-foreground">Gerencie suas propriedades e vitrines digitais</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to={`/portal/${profile?.name?.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Ver Meu Portal</span>
              </Link>
            </Button>
            <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
              <Link to="/dashboard/new" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Novo Imóvel</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-medium transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-primary/20" />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-medium">
                    R$ {property.price.toLocaleString("pt-BR")}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.neighborhood}
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    {property.bedrooms && <span>{property.bedrooms} quartos</span>}
                    {property.bathrooms && <span>{property.bathrooms} banheiros</span>}
                    {property.area_m2 && <span>{property.area_m2}m²</span>}
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{property.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{property.leads} leads</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                     <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link to={`/property/${property.slug}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link to={`/dashboard/edit/${property.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle>Nenhum imóvel cadastrado</CardTitle>
              <CardDescription>
                Comece criando seu primeiro imóvel e gere sua vitrine digital profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
                <Link to="/dashboard/new" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Cadastrar Primeiro Imóvel</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;