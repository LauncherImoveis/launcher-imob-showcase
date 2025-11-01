-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.set_property_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_property_slug(NEW.title, NEW.user_id);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email, username, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Novo Corretor'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', 'user-' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data ->> 'phone_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    phone_number = EXCLUDED.phone_number;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_property_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;