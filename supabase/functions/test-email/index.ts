import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  email: string;
  type: 'welcome' | 'lead' | 'payment';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { email, type }: TestEmailRequest = await req.json();
    console.log(`[TEST-EMAIL] Sending ${type} test email to: ${email}`);

    let emailResponse;

    switch (type) {
      case 'welcome':
        emailResponse = await resend.emails.send({
          from: "Launcher.imóveis <onboarding@resend.dev>",
          to: [email],
          subject: "[TESTE] Bem-vindo ao Launcher.imóveis! 🏡",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #ef4444; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <strong>⚠️ EMAIL DE TESTE - NÃO É UM EMAIL REAL</strong>
              </div>
              <h1 style="color: #2563eb;">Bem-vindo! 🎉</h1>
              <p>Este é um email de teste do sistema de boas-vindas.</p>
              <p>Se você recebeu este email, significa que a integração com Resend está funcionando corretamente! ✅</p>
            </div>
          `,
        });
        break;

      case 'lead':
        emailResponse = await resend.emails.send({
          from: "Launcher.imóveis <onboarding@resend.dev>",
          to: [email],
          subject: "[TESTE] 🔔 Novo Lead",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #ef4444; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <strong>⚠️ EMAIL DE TESTE - NÃO É UM LEAD REAL</strong>
              </div>
              <h1 style="color: #2563eb;">🎉 Você tem um novo lead!</h1>
              <p>Este é um email de teste de notificação de lead.</p>
              <p>Se você recebeu este email, significa que a integração com Resend está funcionando corretamente! ✅</p>
            </div>
          `,
        });
        break;

      case 'payment':
        emailResponse = await resend.emails.send({
          from: "Launcher.imóveis <onboarding@resend.dev>",
          to: [email],
          subject: "[TESTE] Pagamento Confirmado ✅",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #ef4444; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                <strong>⚠️ EMAIL DE TESTE - NÃO É UM PAGAMENTO REAL</strong>
              </div>
              <h1 style="color: #10b981;">✅ Pagamento Confirmado!</h1>
              <p>Este é um email de teste de confirmação de pagamento.</p>
              <p>Se você recebeu este email, significa que a integração com Resend está funcionando corretamente! ✅</p>
            </div>
          `,
        });
        break;

      default:
        throw new Error('Invalid email type');
    }

    console.log("[TEST-EMAIL] Sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de teste enviado com sucesso!',
        emailResponse 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[TEST-EMAIL] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        hint: error.message.includes('API key') 
          ? 'Verifique se o RESEND_API_KEY está configurado corretamente'
          : 'Verifique os logs para mais detalhes'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
