-- Create products table for persistent inventory storage
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  expiry DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'low', 'out')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for sales tracking
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('sale', 'purchase')),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer TEXT,
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Products policies (admins can do everything, authenticated users can read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Transactions policies
CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Admins can insert transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for products timestamp
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial Philippine products
INSERT INTO public.products (name, category, quantity, price, expiry, status) VALUES
  ('NFA Rice 5kg', 'Rice & Grains', 85, 250, '2025-06-15', 'normal'),
  ('Lucky Me Pancit Canton', 'Snacks', 120, 12, '2025-08-20', 'normal'),
  ('Argentina Corned Beef 260g', 'Canned Goods', 45, 65, '2026-03-10', 'normal'),
  ('Century Tuna Flakes 155g', 'Canned Goods', 18, 42, '2026-01-15', 'low'),
  ('Bear Brand Powdered Milk 300g', 'Dairy', 32, 145, '2025-04-20', 'normal'),
  ('Coca-Cola 1.5L', 'Beverages', 48, 75, '2025-07-30', 'normal'),
  ('RC Cola 1L', 'Beverages', 0, 38, '2025-05-15', 'out'),
  ('Datu Puti Soy Sauce 1L', 'Condiments', 28, 58, '2026-02-28', 'normal'),
  ('UFC Banana Ketchup 550g', 'Condiments', 15, 72, '2025-09-10', 'low'),
  ('Piattos Cheese 85g', 'Snacks', 65, 38, '2025-03-25', 'normal'),
  ('Skyflakes Crackers 250g', 'Snacks', 42, 45, '2025-05-12', 'normal'),
  ('Magnolia Chicken Tocino 500g', 'Frozen', 22, 165, '2025-02-28', 'normal'),
  ('CDO Longganisa 500g', 'Frozen', 8, 145, '2025-02-15', 'low'),
  ('Eden Cheese 160g', 'Dairy', 35, 95, '2025-04-10', 'normal'),
  ('Nescafe 3-in-1 Original 30s', 'Beverages', 55, 285, '2025-10-20', 'normal'),
  ('Alaska Evaporada 370ml', 'Dairy', 40, 48, '2026-01-05', 'normal'),
  ('Safeguard Soap 135g', 'Personal Care', 60, 52, '2027-06-15', 'normal'),
  ('Tide Powder 1kg', 'Household', 25, 165, '2027-03-20', 'normal'),
  ('Joy Dishwashing Liquid 495ml', 'Household', 38, 95, '2026-08-10', 'normal'),
  ('San Marino Corned Tuna 150g', 'Canned Goods', 0, 45, '2025-12-15', 'out'),
  ('555 Sardines 155g', 'Canned Goods', 52, 28, '2026-04-20', 'normal'),
  ('Ginebra San Miguel 750ml', 'Beverages', 12, 125, '2028-01-01', 'low'),
  ('Rebisco Crackers 330g', 'Snacks', 30, 55, '2025-06-08', 'normal'),
  ('Silver Swan Vinegar 1L', 'Condiments', 22, 45, '2026-05-15', 'normal'),
  ('Delimondo Corned Beef 380g', 'Canned Goods', 18, 185, '2026-02-20', 'low');