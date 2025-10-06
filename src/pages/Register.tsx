import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const schema = z.object({
    name: z.string().trim().min(2, { message: "Informe seu nome" }).max(100),
    email: z.string().trim().email({ message: "E-mail inválido" }).max(255),
    password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }).max(128),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você precisa aceitar os termos de uso"
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      toast({ title: "Erro", description: parsed.error.issues[0]?.message ?? "Dados inválidos" });
      return;
    }

    const redirectUrl = `${window.location.origin}/`;
    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { name: formData.name },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      toast({ title: "Falha no cadastro", description: error.message });
      return;
    }

    // Send welcome email
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: { name: formData.name, email: formData.email }
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    if (data.session) {
      toast({ title: "Conta criada", description: "Redirecionando para o dashboard..." });
      navigate("/dashboard");
    } else {
      toast({ title: "Verifique seu e-mail", description: "Enviamos um link de confirmação." });
      navigate("/login");
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <CardTitle className="text-2xl font-bold text-center">Criar conta grátis</CardTitle>
            <CardDescription className="text-center">
              Comece a criar suas vitrines digitais em minutos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange("acceptTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  Eu aceito os{" "}
                  <Link to="/termos" target="_blank" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacidade" target="_blank" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full btn-animated bg-gradient-primary hover:bg-primary-hover">
                Criar Minha Conta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Conecte-se ao Supabase para ativar a autenticação completa
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
          >
            Integração Supabase
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;