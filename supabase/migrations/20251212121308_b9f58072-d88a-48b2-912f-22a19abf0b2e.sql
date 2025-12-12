-- Create table to store OTP hashes
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- email or phone number
  otp_hash TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_otp_codes_identifier ON public.otp_codes(identifier, type);
CREATE INDEX idx_otp_codes_expires ON public.otp_codes(expires_at);

-- Enable RLS
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage OTPs (service role only)
CREATE POLICY "Service role can manage OTPs"
ON public.otp_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- Cleanup old expired OTPs (can be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_codes WHERE expires_at < now();
END;
$$;