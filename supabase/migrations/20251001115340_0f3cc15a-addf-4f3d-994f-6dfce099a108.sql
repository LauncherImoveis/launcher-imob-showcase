-- Create property_views table for metrics
CREATE TABLE IF NOT EXISTS public.property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip inet,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Create leads table for contact tracking
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_phone text,
  contact_name text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on property_views
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Enable RLS on leads  
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert property views (for tracking)
CREATE POLICY "Anyone can insert property views"
ON public.property_views
FOR INSERT
WITH CHECK (true);

-- Policy: Users can view their own property views
CREATE POLICY "Users can view their property views"
ON public.property_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_views.property_id
    AND p.user_id = auth.uid()
  )
);

-- Policy: Anyone can insert leads
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Policy: Users can view their own leads
CREATE POLICY "Users can view their leads"
ON public.leads
FOR SELECT
USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_created_at ON public.property_views(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);