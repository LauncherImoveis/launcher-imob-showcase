import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Bed, Bath, Maximize, SlidersHorizontal, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  property_images?: { image_url: string; is_cover: boolean }[];
}

interface Profile {
  name: string;
  profile_picture: string | null;
  phone_number: string | null;
  email: string;
}

const Portal = () => {
  const { userSlug } = useParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    loadProperties();
  }, [userSlug]);

  useEffect(() => {
    applyFilters();
  }, [properties, searchTerm, sortBy, minPrice, maxPrice, bedrooms]);

  const loadProperties = async () => {
    try {
      // Get user by name slug
      const nameFromSlug = userSlug?.replace(/-/g, " ") || "";
      
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, profile_picture, phone_number, email")
        .ilike("name", nameFromSlug);

      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) {
        setLoading(false);
        return;
      }

      const userProfile = profiles[0];
      setProfile({
        name: userProfile.name,
        profile_picture: userProfile.profile_picture,
        phone_number: userProfile.phone_number,
        email: userProfile.email
      });

      // Load active properties with images for this user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            image_url,
            is_cover
          )
        `)
        .eq("user_id", userProfile.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (propertiesError) throw propertiesError;
      setProperties(propertiesData || []);
      setFilteredProperties(propertiesData || []);
    } catch (error) {
      console.error("Error loading portal:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filters
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== "all") {
      filtered = filtered.filter(p => p.bedrooms === Number(bedrooms));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        // Already sorted by created_at desc from query
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "area-desc":
        filtered.sort((a, b) => (b.area_m2 || 0) - (a.area_m2 || 0));
        break;
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Building2 className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Hero Header with Gradient */}
      <header className="relative bg-gradient-primary text-primary-foreground overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Agent Profile */}
            <div className="flex items-center gap-6">
              {profile?.profile_picture ? (
                <img 
                  src={profile.profile_picture} 
                  alt={profile.name}
                  className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-4 border-white/30 shadow-strong"
                />
              ) : (
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-strong">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {profile?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                  {profile?.name}
                </h1>
                <p className="text-primary-foreground/90 text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Corretor de Imóveis Profissional
                </p>
              </div>
            </div>
            
            {/* Contact CTA */}
            {profile?.phone_number && (
              <div className="flex flex-col gap-3">
                <a 
                  href={`https://wa.me/${profile.phone_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp hover:bg-whatsapp-hover text-whatsapp-foreground px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-medium transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="text-xl">💬</span>
                  <span>Falar no WhatsApp</span>
                </a>
                <p className="text-primary-foreground/80 text-sm text-center">
                  {profile.phone_number}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" className="w-full h-8 md:h-12 text-secondary/30" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,32L80,29.3C160,27,320,21,480,21.3C640,21,800,27,960,32C1120,37,1280,43,1360,45.3L1440,48L1440,48L1360,48C1280,48,1120,48,960,48C800,48,640,48,480,48C320,48,160,48,80,48L0,48Z" />
          </svg>
        </div>
      </header>

      {/* Properties Section */}
      <div className="container mx-auto px-4 py-12">
        {properties.length > 0 ? (
          <>
            {/* Header with count */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Imóveis Disponíveis</h2>
              <p className="text-muted-foreground">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
                {filteredProperties.length !== properties.length && ` de ${properties.length} total`}
              </p>
            </div>

            {/* Filters Section */}
            <Card className="mb-8 p-6 bg-card shadow-medium">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Filtros e Ordenação</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por título ou localização..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Min Price */}
                <Input
                  type="number"
                  placeholder="Preço mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />

                {/* Max Price */}
                <Input
                  type="number"
                  placeholder="Preço máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />

                {/* Bedrooms */}
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quartos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="1">1 quarto</SelectItem>
                    <SelectItem value="2">2 quartos</SelectItem>
                    <SelectItem value="3">3 quartos</SelectItem>
                    <SelectItem value="4">4+ quartos</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="area-desc">Maior área</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                {(searchTerm || minPrice || maxPrice || (bedrooms && bedrooms !== "all") || sortBy !== "newest") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setMinPrice("");
                      setMaxPrice("");
                      setBedrooms("all");
                      setSortBy("newest");
                    }}
                    className="lg:col-span-5"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </Card>
            
            {/* Properties Grid */}
            {currentProperties.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProperties.map((property) => {
                const coverImage = property.property_images?.find(img => img.is_cover)?.image_url 
                  || property.property_images?.[0]?.image_url;
                
                return (
                  <Card 
                    key={property.id} 
                    className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-strong bg-card"
                  >
                    {/* Property Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-secondary">
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Building2 className="h-16 w-16 text-primary/20" />
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 shadow-strong backdrop-blur-sm">
                          <p className="text-xs font-medium mb-0.5">Valor</p>
                          <p className="text-lg font-bold">
                            R$ {property.price.toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  
                    <CardContent className="p-6">
                      {/* Title */}
                      <h3 className="font-bold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      
                      {/* Location */}
                      <div className="flex items-start gap-2 text-muted-foreground mb-4 pb-4 border-b border-border">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                        <span className="text-sm line-clamp-1">{property.neighborhood}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex items-center justify-around gap-2 mb-5 pb-5 border-b border-border">
                        {property.bedrooms && (
                          <div className="flex flex-col items-center gap-1">
                            <Bed className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold text-foreground">{property.bedrooms}</span>
                            <span className="text-xs text-muted-foreground">quartos</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex flex-col items-center gap-1">
                            <Bath className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold text-foreground">{property.bathrooms}</span>
                            <span className="text-xs text-muted-foreground">banheiros</span>
                          </div>
                        )}
                        {property.area_m2 && (
                          <div className="flex flex-col items-center gap-1">
                            <Maximize className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold text-foreground">{property.area_m2}</span>
                            <span className="text-xs text-muted-foreground">m²</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6 transition-all duration-300 hover:scale-105 active:scale-95 shadow-soft" 
                        asChild
                      >
                        <Link to={`/property/${property.slug}`}>
                          Ver Detalhes Completos
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-foreground">Nenhum imóvel encontrado</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto mb-6">
                  Tente ajustar os filtros para ver mais resultados.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setMinPrice("");
                    setMaxPrice("");
                    setBedrooms("all");
                    setSortBy("newest");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-foreground">Nenhum imóvel disponível</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Este corretor ainda não cadastrou imóveis. Volte em breve para conferir as novidades!
            </p>
          </div>
        )}
      </div>
      
      {/* Footer CTA */}
      {profile?.phone_number && properties.length > 0 && (
        <div className="bg-gradient-primary text-primary-foreground py-12 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Interessado em algum imóvel?
            </h3>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Entre em contato comigo pelo WhatsApp e agende uma visita!
            </p>
            <a 
              href={`https://wa.me/${profile.phone_number.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-whatsapp hover:bg-whatsapp-hover text-whatsapp-foreground px-8 py-4 rounded-lg font-bold text-lg shadow-strong transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="text-2xl">💬</span>
              <span>Falar com {profile.name}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
