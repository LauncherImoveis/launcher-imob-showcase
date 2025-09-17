-- Create ENUM types
CREATE TYPE public.plan_type AS ENUM ('free', 'credits', 'pro');
CREATE TYPE public.link_type AS ENUM ('property', 'portal');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture TEXT,
  phone_number TEXT,
  plan_type plan_type DEFAULT 'free',
  credits INTEGER DEFAULT 0,
  custom_logo TEXT,
  primary_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT,
  description TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  area_m2 DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  garages INTEGER,
  whatsapp_number TEXT NOT NULL,
  video_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create links table
CREATE TABLE public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  url_slug TEXT UNIQUE NOT NULL,
  type link_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  plan_type plan_type,
  credits_purchased INTEGER DEFAULT 0,
  payment_provider TEXT,
  transaction_id TEXT UNIQUE,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table (optional - Supabase handles this, but keeping for compatibility)
CREATE TABLE public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_properties_is_active ON public.properties(is_active);
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_links_url_slug ON public.links(url_slug);
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_token ON public.sessions(token);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for properties
CREATE POLICY "Users can view their own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = user_id);

-- Public access for active properties (for public viewing)
CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (is_active = true);

-- RLS Policies for property_images
CREATE POLICY "Users can manage images of their properties"
  ON public.property_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.user_id = auth.uid()
    )
  );

-- Public access for images of active properties
CREATE POLICY "Anyone can view images of active properties"
  ON public.property_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id AND p.is_active = true
    )
  );

-- RLS Policies for links
CREATE POLICY "Users can manage their own links"
  ON public.links FOR ALL
  USING (auth.uid() = user_id);

-- Public access for links (for public viewing)
CREATE POLICY "Anyone can view links"
  ON public.links FOR SELECT
  USING (true);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for sessions
CREATE POLICY "Users can manage their own sessions"
  ON public.sessions FOR ALL
  USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Novo Corretor'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_property_slug(title TEXT, user_id UUID)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Function to check user property limits
CREATE OR REPLACE FUNCTION public.check_property_limits()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for property limits
CREATE TRIGGER check_property_limits_trigger
  BEFORE INSERT ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.check_property_limits();