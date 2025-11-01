-- Add 'premium' to plan_type enum
ALTER TYPE plan_type ADD VALUE IF NOT EXISTS 'premium';

-- Create CRM Stages table
CREATE TABLE IF NOT EXISTS public.crm_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  default_probability INTEGER DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CRM Deals table
CREATE TABLE IF NOT EXISTS public.crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value BIGINT DEFAULT 0,
  expected_close_date DATE,
  stage_id UUID REFERENCES public.crm_stages(id) ON DELETE SET NULL,
  probability INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create CRM Interactions table
CREATE TABLE IF NOT EXISTS public.crm_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'ligacao', 'email', 'visita', 'nota')),
  direction TEXT CHECK (direction IN ('in', 'out')),
  message TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CRM Transactions table
CREATE TABLE IF NOT EXISTS public.crm_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  commission_pct NUMERIC(5,2),
  commission_amount BIGINT,
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CRM Reminders table
CREATE TABLE IF NOT EXISTS public.crm_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  repeat_rule TEXT,
  note TEXT,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CRM Tags table
CREATE TABLE IF NOT EXISTS public.crm_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create CRM Lead Tags junction table
CREATE TABLE IF NOT EXISTS public.crm_lead_tags (
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.crm_tags(id) ON DELETE CASCADE,
  PRIMARY KEY(lead_id, tag_id)
);

-- Create Activity Log table
CREATE TABLE IF NOT EXISTS public.crm_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  action TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crm_stages_user_id ON public.crm_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_user_id ON public.crm_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage_id ON public.crm_deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_status ON public.crm_deals(status);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_user_id ON public.crm_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_lead_id ON public.crm_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_deal_id ON public.crm_interactions(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_transactions_user_id ON public.crm_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_reminders_user_id ON public.crm_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_reminders_remind_at ON public.crm_reminders(remind_at);
CREATE INDEX IF NOT EXISTS idx_crm_activity_log_user_id ON public.crm_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_activity_log_resource ON public.crm_activity_log(resource_type, resource_id);

-- Enable RLS
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_stages
CREATE POLICY "Users can manage their own stages"
  ON public.crm_stages FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_deals
CREATE POLICY "Users can manage their own deals"
  ON public.crm_deals FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_interactions
CREATE POLICY "Users can manage their own interactions"
  ON public.crm_interactions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_transactions
CREATE POLICY "Users can manage their own transactions"
  ON public.crm_transactions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_reminders
CREATE POLICY "Users can manage their own reminders"
  ON public.crm_reminders FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_tags
CREATE POLICY "Users can manage their own tags"
  ON public.crm_tags FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for crm_lead_tags
CREATE POLICY "Users can manage their own lead tags"
  ON public.crm_lead_tags FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = crm_lead_tags.lead_id
    AND leads.user_id = auth.uid()
  ));

-- RLS Policies for crm_activity_log
CREATE POLICY "Users can view their own activity log"
  ON public.crm_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity log"
  ON public.crm_activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_crm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_crm_stages_updated_at
  BEFORE UPDATE ON public.crm_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

CREATE TRIGGER update_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_updated_at();

-- Create function to initialize default stages for new premium users
CREATE OR REPLACE FUNCTION public.initialize_default_crm_stages()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create stages if user becomes premium
  IF NEW.plan_type = 'premium' AND (OLD.plan_type IS NULL OR OLD.plan_type != 'premium') THEN
    INSERT INTO public.crm_stages (user_id, name, sort_order, default_probability, color)
    VALUES
      (NEW.id, 'Novo', 1, 10, '#6B7280'),
      (NEW.id, 'Contato Feito', 2, 30, '#3B82F6'),
      (NEW.id, 'Visita Agendada', 3, 50, '#8B5CF6'),
      (NEW.id, 'Negociação', 4, 70, '#F59E0B'),
      (NEW.id, 'Documentação', 5, 90, '#10B981'),
      (NEW.id, 'Fechado', 6, 100, '#22C55E'),
      (NEW.id, 'Perdido', 7, 0, '#EF4444');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to initialize stages
CREATE TRIGGER initialize_user_crm_stages
  AFTER INSERT OR UPDATE OF plan_type ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_default_crm_stages();