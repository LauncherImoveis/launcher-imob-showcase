import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  agentName: string;
  agentEmail: string;
  propertyTitle: string;
  contactName: string;
  contactPhone: string;
  message?: string;
  propertyUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      agentName, 
      agentEmail, 
      propertyTitle, 
      contactName, 
      contactPhone, 
      message,
      propertyUrl 
    }: LeadNotificationRequest = await req.json();
    
    console.log(`[LEAD-NOTIFICATION] Sending to: ${agentEmail}`);

    const emailResponse = await resend.emails.send({
      from: "Launcher.imóveis <onboarding@resend.dev>",
      to: [agentEmail],
      subject: `🔔 Novo Lead: ${contactName} interessado em ${propertyTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🎉 Você tem um novo lead!</h1>
          </div>
          
          <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p>Olá ${agentName},</p>
            
            <p>Alguém demonstrou interesse em um dos seus imóveis!</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h2 style="margin-top: 0; color: #1f2937;">Detalhes do Contato</h2>
              <table style="width: 100%; color: #4b5563;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Nome:</strong></td>
                  <td>${contactName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Telefone:</strong></td>
                  <td><a href="tel:${contactPhone}" style="color: #2563eb;">${contactPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Imóvel:</strong></td>
                  <td>${propertyTitle}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;"><strong>Mensagem:</strong></td>
                  <td style="padding: 8px 0;">${message}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                ⚡ <strong>Dica:</strong> Quanto mais rápido você responder, maior a chance de fechar negócio!
              </p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://wa.me/55${contactPhone.replace(/\D/g, '')}" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                📱 Contatar via WhatsApp
              </a>
              <a href="${propertyUrl}" 
                 style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🏡 Ver Imóvel
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Este lead foi gerado através do seu portal digital no Launcher.imóveis
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            Launcher.imóveis - Vitrines Digitais para Corretores<br>
            © ${new Date().getFullYear()} Todos os direitos reservados
          </p>
        </div>
      `,
    });

    console.log("[LEAD-NOTIFICATION] Sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[LEAD-NOTIFICATION] Error:", error);
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
