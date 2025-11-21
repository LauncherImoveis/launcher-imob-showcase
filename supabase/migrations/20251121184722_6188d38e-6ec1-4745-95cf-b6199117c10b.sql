-- Atualizar tabela leads para incluir novos campos do CRM
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'platform',
  ADD COLUMN IF NOT EXISTS interest TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMP WITH TIME ZONE;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_contact_phone ON public.leads(contact_phone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_origin ON public.leads(origin);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- Atualizar RLS policies para permitir usuários gerenciarem seus leads
DROP POLICY IF EXISTS "Users can view their leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

CREATE POLICY "Users can manage their own leads"
  ON public.leads
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Criar tabela de configurações do CRM (para armazenar preferências do usuário)
CREATE TABLE IF NOT EXISTS public.crm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commission_default_pct NUMERIC(5,2) DEFAULT 5.00,
  notification_email BOOLEAN DEFAULT true,
  notification_in_app BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.crm_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
  ON public.crm_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Adicionar trigger para updated_at em crm_settings
CREATE TRIGGER update_crm_settings_updated_at
  BEFORE UPDATE ON public.crm_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

-- Adicionar campo color às tags se não existir
ALTER TABLE public.crm_tags 
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6B7280';

-- Garantir que todos os deals tenham timestamps corretos
ALTER TABLE public.crm_deals
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- Comentários para documentação
COMMENT ON COLUMN public.leads.origin IS 'Origem do lead: platform, whatsapp, instagram, indicacao, ligacao, email, outros';
COMMENT ON COLUMN public.leads.status IS 'Status do lead: active, contacted, qualified, unqualified, converted, lost';
COMMENT ON TABLE public.crm_settings IS 'Configurações personalizadas do CRM por usuário';