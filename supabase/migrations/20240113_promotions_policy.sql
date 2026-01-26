-- Migration: Add update policy for promotions table
-- Description: Allows admins to update promotions (needed for invoice_sent_at)

DROP POLICY IF EXISTS "Admins can update promotions" ON public.promotions;

CREATE POLICY "Admins can update promotions"
ON public.promotions
FOR UPDATE
TO authenticated
USING (
  (SELECT user_number FROM public.profiles WHERE id = auth.uid()) = 1001
)
WITH CHECK (
  (SELECT user_number FROM public.profiles WHERE id = auth.uid()) = 1001
);

-- Note: This assumes the admin user has user_number 1001.
