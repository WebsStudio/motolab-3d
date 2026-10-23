CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  service TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  bike_make TEXT NOT NULL,
  bike_model TEXT NOT NULL,
  bike_year TEXT NOT NULL,
  bike_notes TEXT NOT NULL DEFAULT '',
  preferred_date DATE,
  preferred_slot TEXT NOT NULL DEFAULT 'indiferente',
  flexibility TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT ''
);

GRANT INSERT ON public.booking_requests TO anon;
GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous visitors can submit a booking request"
ON public.booking_requests FOR INSERT TO anon
WITH CHECK (true);

-- Rate check runs as definer so anonymous visitors can ask "am I already in?"
-- without being able to read the table.
CREATE OR REPLACE FUNCTION public.booking_rate_ok(_phone text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.booking_requests
    WHERE phone = _phone
      AND created_at > now() - interval '10 minutes'
  )
$$;

GRANT EXECUTE ON FUNCTION public.booking_rate_ok(text) TO anon;