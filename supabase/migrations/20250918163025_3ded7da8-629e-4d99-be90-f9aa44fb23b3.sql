-- Fix search_path security warnings by setting search_path on functions

-- Update handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Novo Corretor'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

-- Update generate_property_slug function with secure search_path
CREATE OR REPLACE FUNCTION public.generate_property_slug(title TEXT, user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert title to slug format
  base_slug := lower(trim(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'imovel';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.properties WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Update check_property_limits function with secure search_path
CREATE OR REPLACE FUNCTION public.check_property_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  IF user_plan = 'free' AND active_properties >= 3 THEN
    RAISE EXCEPTION 'Limite de 3 imóveis atingido no plano gratuito';
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

-- Update update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;