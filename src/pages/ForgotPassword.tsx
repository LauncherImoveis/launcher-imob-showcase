import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const schema = z.object({
    email: z.string().trim().email({ message: "E-mail inválido" }).max(255),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0]?.message ?? "E-mail inválido" });
      return;
    }

    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setIsLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message });
      return;
    }

    setEmailSent(true);
    toast({ 
      title: "E-mail enviado", 
      description: "Verifique sua caixa de entrada para resetar sua senha." 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">Launcher</span>
              <span className="text-xl font-semibold text-foreground">.imóveis</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-strong">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Esqueceu sua senha?</CardTitle>
            <CardDescription className="text-center">
              {emailSent 
                ? "Um e-mail foi enviado com instruções para resetar sua senha."
                : "Digite seu e-mail e enviaremos instruções para resetar sua senha."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-animated bg-gradient-primary hover:bg-primary-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar instruções"}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Se o e-mail estiver cadastrado, você receberá as instruções em alguns minutos.
                </div>
                <Button 
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Enviar novamente
                </Button>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
