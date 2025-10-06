import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Bed, Bath, Car, Ruler, ArrowLeft, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const PropertyView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_cover
          ),
          profiles (
            name,
            phone_number,
            profile_picture,
            email
          )
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // SEO: Update meta tags
  useEffect(() => {
    if (property) {
      const title = `${property.title} - ${property.neighborhood || property.address} | Launcher.imóveis`;
      document.title = title;
    }
  }, [property]);

  // Record property view
  useEffect(() => {
    if (property) {
      const recordView = async () => {
        try {
          await supabase.from("property_views").insert({
            property_id: property.id,
            user_id: property.user_id,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });
        } catch (error) {
          console.error("Error recording view:", error);
        }
      };
      recordView();
    }
  }, [property]);

  const handleWhatsAppClick = async () => {
    if (!property) return;

    const phone = property.whatsapp_number;
    const message = encodeURIComponent(
      `Olá, tenho interesse no imóvel ${property.title} — link: ${window.location.href}`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // Record lead
    try {
      await supabase.from("leads").insert({
        property_id: property.id,
        user_id: property.user_id,
        contact_phone: phone,
        message: `Interesse via WhatsApp`,
      });

      // Send lead notification email to property owner
      if (property.profiles?.email) {
        await supabase.functions.invoke('send-lead-notification', {
          body: {
            agentEmail: property.profiles.email,
            agentName: property.profiles.name,
            propertyTitle: property.title,
            propertyUrl: window.location.href,
            leadPhone: phone
          }
        });
      }
    } catch (error) {
      console.error("Error recording lead:", error);
    }

    window.open(whatsappUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando imóvel...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Imóvel não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            Este imóvel não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const coverImage = property?.property_images?.find((img: any) => img.is_cover)?.image_url ||
    property?.property_images?.[0]?.image_url;
  const description = property?.description.substring(0, 160) + (property?.description.length > 160 ? '...' : '');

  return (
    <>
      {property && (
        <Helmet>
          <title>{property.title} - {property.neighborhood || property.address} | Launcher.imóveis</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={`${property.title} - ${property.neighborhood || property.address}`} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          {coverImage && <meta property="og:image" content={coverImage} />}
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${property.title} - ${property.neighborhood || property.address}`} />
          <meta name="twitter:description" content={description} />
          {coverImage && <meta name="twitter:image" content={coverImage} />}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": property.title,
              "description": property.description,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": property.address,
                "addressLocality": property.neighborhood,
              },
              "offers": {
                "@type": "Offer",
                "price": property.price,
                "priceCurrency": "BRL"
              },
              "numberOfBedrooms": property.bedrooms,
              "numberOfBathroomsTotal": property.bathrooms,
              "floorSize": {
                "@type": "QuantitativeValue",
                "value": property.area_m2,
                "unitCode": "MTK"
              },
              "image": property.property_images?.map((img: any) => img.image_url) || []
            })}
          </script>
        </Helmet>
      )}
      
      <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-24 w-24 text-muted-foreground" />
              </div>
            )}

            {property.property_images && property.property_images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {property.property_images.slice(1, 5).map((img: any) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt="Property"
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            )}

            {/* Details */}
            <Card className="p-6">
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}</span>
                {property.neighborhood && <span className="ml-2">• {property.neighborhood}</span>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.area_m2 && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Área</div>
                      <div className="font-semibold">{property.area_m2}m²</div>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Quartos</div>
                      <div className="font-semibold">{property.bedrooms}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Banheiros</div>
                      <div className="font-semibold">{property.bathrooms}</div>
                    </div>
                  </div>
                )}
                {property.garages && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Garagens</div>
                      <div className="font-semibold">{property.garages}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
              </div>

              {property.video_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Vídeo</h3>
                  <div className="aspect-video">
                    <iframe
                      src={property.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="text-3xl font-bold text-primary mb-6">
                {property.price
                  ? `R$ ${Number(property.price).toLocaleString('pt-BR')}`
                  : "Consulte o preço"}
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white mb-4"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Entrar em Contato
              </Button>

              {property.profiles && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Anunciado por</p>
                  <div className="flex items-center gap-3">
                    {property.profiles.profile_picture ? (
                      <img 
                        src={property.profiles.profile_picture} 
                        alt={property.profiles.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {property.profiles.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{property.profiles.name}</p>
                      {property.profiles.phone_number && (
                        <p className="text-sm text-muted-foreground">
                          {property.profiles.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PropertyView;
