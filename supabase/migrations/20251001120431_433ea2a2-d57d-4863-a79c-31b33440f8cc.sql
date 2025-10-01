-- Update plan limits (FREE=2, PRO=15)
-- Drop existing trigger and function to recreate with new limits
DROP TRIGGER IF EXISTS check_property_limits_trigger ON public.properties;
DROP FUNCTION IF EXISTS public.check_property_limits();

-- Recreate function with updated limits
CREATE OR REPLACE FUNCTION public.check_property_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_plan plan_type;
  user_credits INTEGER;
  active_properties INTEGER;
BEGIN
  -- Get user's plan and credits
  SELECT plan_type, credits INTO user_plan, user_credits
  FROM public.profiles WHERE id = NEW.user_id;
  
  -- Count active properties
  SELECT COUNT(*) INTO active_properties
  FROM public.properties 
  WHERE user_id = NEW.user_id AND is_active = true;
  
  -- Check limits based on plan
  IF user_plan = 'free' AND active_properties >= 2 THEN
    RAISE EXCEPTION 'Limite de 2 imóveis atingido no plano gratuito';
  ELSIF user_plan = 'pro' AND active_properties >= 15 THEN
    RAISE EXCEPTION 'Limite de 15 imóveis atingido no plano Pro';
  ELSIF user_plan = 'credits' AND user_credits <= 0 THEN
    RAISE EXCEPTION 'Créditos insuficientes para criar novo imóvel';
  END IF;
  
  -- Consume credit if on credits plan
  IF user_plan = 'credits' AND TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET credits = credits - 1 
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER check_property_limits_trigger
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.check_property_limits();

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property images
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own property images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own property images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);