-- Create partner_settings table for white-labeling
CREATE TABLE public.partner_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL DEFAULT 'Walang''s Consumer Goods Trading',
  primary_color text NOT NULL DEFAULT '#DC2626',
  secondary_color text NOT NULL DEFAULT '#FFFFFF',
  logo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view partner settings (for branding)
CREATE POLICY "Anyone can view partner settings"
ON public.partner_settings
FOR SELECT
USING (true);

-- Only admins can update partner settings
CREATE POLICY "Admins can update partner settings"
ON public.partner_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert partner settings"
ON public.partner_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add super_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE 'super_admin';

-- Insert default partner settings for Walang's
INSERT INTO public.partner_settings (partner_name, primary_color, secondary_color)
VALUES ('Walang''s Consumer Goods Trading', '#DC2626', '#FFFFFF');

-- Add brand column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand text;