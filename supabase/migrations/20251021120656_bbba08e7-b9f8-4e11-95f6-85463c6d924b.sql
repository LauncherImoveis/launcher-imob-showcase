-- Add username column to profiles for unique mini-site URLs
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;

-- Generate unique usernames for existing users
UPDATE public.profiles 
SET username = lower(regexp_replace(name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substring(id::text, 1, 8)
WHERE username IS NULL;

-- Make username required for new users
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;

-- Create function to auto-generate property slugs on insert
CREATE OR REPLACE FUNCTION public.set_property_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_property_slug(NEW.title, NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate slugs for new properties
CREATE TRIGGER generate_slug_on_insert
BEFORE INSERT ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.set_property_slug();

-- Update RLS policy to allow public read of username
CREATE POLICY "Anyone can view usernames for portals"
ON public.profiles
FOR SELECT
USING (true);