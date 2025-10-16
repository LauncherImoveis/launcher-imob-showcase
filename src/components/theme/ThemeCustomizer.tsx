import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Palette, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  COLOR_PALETTES,
  isValidHex,
  normalizeHex,
  hexToHsl,
  getContrastRatio,
  getContrastColor,
  meetsWCAGAA,
} from "@/lib/colorUtils";

export function ThemeCustomizer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("#0b3b66");
  const [customHex, setCustomHex] = useState<string>("");
  const [contrastWarning, setContrastWarning] = useState<string>("");

  // Fetch current profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Set initial color when profile loads
  useEffect(() => {
    if (profile?.primary_color) {
      setSelectedColor(profile.primary_color);
    }
  }, [profile]);

  // Check contrast when color changes
  useEffect(() => {
    const contrastWhite = getContrastRatio(selectedColor, "#FFFFFF");
    const contrastBlack = getContrastRatio(selectedColor, "#000000");
    const bestContrast = Math.max(contrastWhite, contrastBlack);

    if (bestContrast < 4.5) {
      setContrastWarning(
        `Contraste insuficiente (${bestContrast.toFixed(1)}:1). Recomendado mínimo 4.5:1 para acessibilidade.`
      );
    } else {
      setContrastWarning("");
    }
  }, [selectedColor]);

  // Update theme mutation
  const updateTheme = useMutation({
    mutationFn: async (color: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ primary_color: color })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Tema atualizado",
        description: "A cor do seu mini-site foi alterada com sucesso.",
      });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar tema",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePaletteSelect = (hex: string) => {
    setSelectedColor(hex);
    setCustomHex("");
  };

  const handleCustomHexChange = (value: string) => {
    setCustomHex(value);
    
    let hex = value.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }

    if (isValidHex(hex)) {
      setSelectedColor(normalizeHex(hex));
    }
  };

  const handleSave = () => {
    if (!isValidHex(selectedColor)) {
      toast({
        title: "Cor inválida",
        description: "Por favor, selecione uma cor válida.",
        variant: "destructive",
      });
      return;
    }

    updateTheme.mutate(normalizeHex(selectedColor));
  };

  const handleResetToDefault = () => {
    setSelectedColor("#0b3b66");
    setCustomHex("");
  };

  const contrastColor = getContrastColor(selectedColor);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Palette className="h-4 w-4" />
          Personalizar Tema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Personalizar Tema do Mini-site</DialogTitle>
          <DialogDescription>
            Escolha a cor primária do seu portal de imóveis. A cor será aplicada em botões, links e destaques.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className="p-6 rounded-lg border-2 space-y-4"
              style={{ 
                backgroundColor: selectedColor,
                color: contrastColor,
              }}
            >
              <h3 className="text-xl font-bold">Seu Portal de Imóveis</h3>
              <p className="text-sm opacity-90">
                Esta é uma prévia de como ficará o cabeçalho do seu mini-site.
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: contrastColor,
                    color: selectedColor,
                  }}
                >
                  Botão Primário
                </button>
                <button
                  className="px-4 py-2 rounded-md font-medium border-2"
                  style={{
                    borderColor: contrastColor,
                    color: contrastColor,
                  }}
                >
                  Botão Secundário
                </button>
              </div>
            </div>
          </div>

          {/* Contrast Warning */}
          {contrastWarning && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{contrastWarning}</AlertDescription>
            </Alert>
          )}

          {/* Predefined Palettes */}
          <div className="space-y-2">
            <Label>Paletas Predefinidas</Label>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.hex}
                  onClick={() => handlePaletteSelect(palette.hex)}
                  className="relative group"
                  title={palette.name}
                >
                  <div
                    className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      backgroundColor: palette.hex,
                      borderColor: selectedColor === palette.hex ? "#000" : "transparent",
                    }}
                  >
                    {selectedColor === palette.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {palette.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <Label htmlFor="custom-hex">Cor Personalizada (HEX)</Label>
            <div className="flex gap-2">
              <Input
                id="custom-hex"
                placeholder="#000000"
                value={customHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                maxLength={7}
              />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  setCustomHex(e.target.value);
                }}
                className="w-16 h-10 rounded border cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Digite um código HEX (ex: #FF5733) ou use o seletor de cores
            </p>
          </div>

          {/* Color Info */}
          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
            <p><strong>Cor atual:</strong> {selectedColor}</p>
            <p><strong>Cor de texto:</strong> {contrastColor === "#FFFFFF" ? "Branco" : "Preto"}</p>
            <p><strong>Contraste:</strong> {getContrastRatio(selectedColor, contrastColor).toFixed(1)}:1</p>
            {meetsWCAGAA(selectedColor, contrastColor) && (
              <p className="text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Atende WCAG AA (Acessível)
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleResetToDefault}>
            Reverter para Padrão
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateTheme.isPending}>
            {updateTheme.isPending ? "Salvando..." : "Salvar Tema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
