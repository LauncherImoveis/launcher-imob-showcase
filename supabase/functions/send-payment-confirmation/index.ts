import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentConfirmationRequest {
  name: string;
  email: string;
  plan: string;
  amount: string;
  transactionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, plan, amount, transactionId }: PaymentConfirmationRequest = await req.json();
    console.log(`[PAYMENT-CONFIRMATION] Sending to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Launcher.imóveis <onboarding@resend.dev>",
      to: [email],
      subject: "Pagamento Confirmado - Launcher.imóveis ✅",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0;">✅ Pagamento Confirmado!</h1>
          </div>
          
          <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p>Olá ${name},</p>
            
            <p>Seu pagamento foi processado com sucesso! 🎉</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">Detalhes do Pagamento</h2>
              <table style="width: 100%; color: #4b5563;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Plano:</strong></td>
                  <td style="text-align: right;">${plan}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Valor:</strong></td>
                  <td style="text-align: right;">R$ ${amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>ID Transação:</strong></td>
                  <td style="text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Data:</strong></td>
                  <td style="text-align: right;">${new Date().toLocaleDateString('pt-BR')}</td>
                </tr>
              </table>
            </div>
            
            <p>Seu plano já está ativo e você pode começar a usar todos os recursos imediatamente!</p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://launcher.imoveis.com/dashboard" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Acessar Dashboard
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Precisa do recibo? Entre em contato respondendo este email.
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            Launcher.imóveis - Vitrines Digitais para Corretores<br>
            © ${new Date().getFullYear()} Todos os direitos reservados
          </p>
        </div>
      `,
    });

    console.log("[PAYMENT-CONFIRMATION] Sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[PAYMENT-CONFIRMATION] Error:", error);
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
