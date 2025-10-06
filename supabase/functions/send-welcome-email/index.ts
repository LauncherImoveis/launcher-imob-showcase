import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: WelcomeEmailRequest = await req.json();
    console.log(`[WELCOME-EMAIL] Sending to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Launcher.imóveis <onboarding@resend.dev>",
      to: [email],
      subject: "Bem-vindo ao Launcher.imóveis! 🏡",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Bem-vindo, ${name}! 🎉</h1>
          
          <p>Estamos felizes em ter você no Launcher.imóveis!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1f2937;">Primeiros Passos:</h2>
            <ul style="color: #4b5563;">
              <li>📸 Adicione seu primeiro imóvel</li>
              <li>🎨 Personalize seu portal</li>
              <li>📱 Compartilhe nas redes sociais</li>
              <li>📊 Acompanhe suas métricas</li>
            </ul>
          </div>
          
          <p>No plano gratuito você pode criar até 2 imóveis. Faça upgrade para ter acesso ilimitado!</p>
          
          <div style="margin: 30px 0;">
            <a href="https://launcher.imoveis.com/dashboard" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Acessar Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Precisa de ajuda? Responda este email que estamos aqui para ajudar!
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Launcher.imóveis - Vitrines Digitais para Corretores<br>
            © ${new Date().getFullYear()} Todos os direitos reservados
          </p>
        </div>
      `,
    });

    console.log("[WELCOME-EMAIL] Sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[WELCOME-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
