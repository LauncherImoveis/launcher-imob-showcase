import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  description: string;
}

const Portal = () => {
  const { userSlug } = useParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadProperties();
  }, [userSlug]);

  const loadProperties = async () => {
    try {
      // Get user by name slug
      const nameFromSlug = userSlug?.replace(/-/g, " ") || "";
      
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .ilike("name", nameFromSlug);

      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) {
        setLoading(false);
        return;
      }

      const profile = profiles[0];
      setUserName(profile.name);

      // Load active properties for this user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", profile.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);
    } catch (error) {
      console.error("Error loading portal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Building2 className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userName}</h1>
              <p className="text-sm text-muted-foreground">Imóveis Disponíveis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-8">
        {properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 relative flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-primary/20" />
                  <div className="absolute top-3 right-3 bg-card rounded-full px-3 py-1 text-sm font-semibold shadow-lg">
                    R$ {property.price.toLocaleString("pt-BR")}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
                  
                  <div className="flex items-start text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{property.neighborhood}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.area_m2 && (
                      <div className="flex items-center">
                        <Maximize className="h-4 w-4 mr-1" />
                        <span>{property.area_m2}m²</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" asChild>
                    <Link to={`/property/${property.slug}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum imóvel disponível</h2>
            <p className="text-muted-foreground">
              Este corretor ainda não cadastrou imóveis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
