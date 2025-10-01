import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ImageUpload } from "@/components/property/ImageUpload";

const PropertyNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    neighborhood: "",
    description: "",
    price: "",
    area_m2: "",
    bedrooms: "",
    bathrooms: "",
    garages: "",
    whatsapp_number: "",
    video_url: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para criar um imóvel.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("properties")
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            address: formData.address,
            neighborhood: formData.neighborhood,
            description: formData.description,
            price: parseFloat(formData.price),
            area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
            garages: formData.garages ? parseInt(formData.garages) : null,
            whatsapp_number: formData.whatsapp_number,
            video_url: formData.video_url || null,
            slug: slug,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Save property images
      if (imageUrls.length > 0 && data) {
        const imageInserts = imageUrls.map((url, index) => ({
          property_id: data.id,
          image_url: url,
          is_cover: index === 0, // First image is cover
        }));

        const { error: imagesError } = await supabase
          .from("property_images")
          .insert(imageInserts);

        if (imagesError) {
          console.error("Error saving images:", imagesError);
          // Don't throw - property was created successfully
        }
      }

      toast({
        title: "Imóvel criado com sucesso!",
        description: "Seu imóvel já está disponível no portal.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating property:", error);
      toast({
        title: "Erro ao criar imóvel",
        description: error.message || "Ocorreu um erro ao criar o imóvel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">Launcher</span>
                <span className="text-lg font-semibold text-foreground">.imóveis</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Cadastrar Novo Imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Imóvel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Ex: Casa Moderna em Copacabana"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Rua, número"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                    placeholder="Ex: Copacabana"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descreva o imóvel..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="850000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area_m2">Área (m²)</Label>
                  <Input
                    id="area_m2"
                    type="number"
                    step="0.01"
                    value={formData.area_m2}
                    onChange={(e) => handleChange("area_m2", e.target.value)}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Quartos</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Banheiros</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="garages">Garagens</Label>
                  <Input
                    id="garages"
                    type="number"
                    value={formData.garages}
                    onChange={(e) => handleChange("garages", e.target.value)}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp *</Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                  placeholder="5521999999999"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Digite apenas números com DDI e DDD (ex: 5521999999999)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">URL do Vídeo (YouTube)</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => handleChange("video_url", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="space-y-2">
                <Label>Fotos do Imóvel</Label>
                <ImageUpload
                  onImagesUploaded={setImageUrls}
                  existingImages={imageUrls}
                />
                <p className="text-xs text-muted-foreground">
                  A primeira foto será a capa do imóvel. Máximo 5MB por imagem.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full btn-animated bg-gradient-primary hover:bg-primary-hover"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Imóvel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyNew;
