import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Eye, Edit, Trash2, ExternalLink, Users, TrendingUp, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - in real app this would come from Supabase
  const mockProperties = [
    {
      id: 1,
      title: "Casa Moderna em Copacabana",
      address: "Rua Barata Ribeiro, 500",
      neighborhood: "Copacabana",
      price: 850000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image: "/placeholder.svg",
      views: 45,
      leads: 8
    },
    {
      id: 2,
      title: "Apartamento Vista Mar",
      address: "Av. Atlântica, 1200",
      neighborhood: "Ipanema",
      price: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      image: "/placeholder.svg",
      views: 32,
      leads: 5
    }
  ];

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
              <span className="text-sm text-muted-foreground">Plano: Grátis (1/3 imóveis)</span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/planos">Upgrade</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/logout">Sair</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imóveis Ativos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">de 3 disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">77</div>
              <p className="text-xs text-muted-foreground">últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-xs text-muted-foreground">contatos WhatsApp</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16.9%</div>
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
              <Link to="/meu-portal" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Ver Meu Portal</span>
              </Link>
            </Button>
            <Button className="btn-animated bg-gradient-primary hover:bg-primary-hover" asChild>
              <Link to="/imovel/novo" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Novo Imóvel</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {mockProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-medium transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-semibold">
                    R$ {property.price.toLocaleString()}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.neighborhood}
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>{property.bedrooms} quartos</span>
                    <span>{property.bathrooms} banheiros</span>
                    <span>{property.area}m²</span>
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
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
                <Link to="/imovel/novo" className="flex items-center space-x-2">
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