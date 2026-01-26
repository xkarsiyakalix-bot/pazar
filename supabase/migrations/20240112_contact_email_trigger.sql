-- Migration: Create trigger for contact email forwarding
-- Description: Triggers the send-contact-email Edge Function on new contact messages.

-- 1. Create the function that will call the Edge Function
CREATE OR REPLACE FUNCTION public.handle_contact_message_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function
  -- Note: You need to replace <PROJECT_REF> with your actual project reference
  -- OR configure this as a Webhook in the Supabase Dashboard which is easier.
  -- This SQL version uses the net extension if available.
  
  -- If using Webhooks (Recommended), you don't need this PL/pgSQL function.
  -- You can simply set it up in Dashboard -> Database -> Webhooks.
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger (if not using Dashboard Webhooks)
-- DROP TRIGGER IF EXISTS on_contact_message_inserted ON public.contact_messages;
-- CREATE TRIGGER on_contact_message_inserted
--   AFTER INSERT ON public.contact_messages
--   FOR EACH ROW EXECUTE FUNCTION public.handle_contact_message_insert();

/*
DASHBOARD SETUP INSTRUCTIONS (Easier and Recommended):
1. Go to Supabase Dashboard -> Database -> Webhooks.
2. Click "Enable Webhooks" if not already enabled.
3. Click "Create a new webhook".
4. Name: `send_contact_email_webhook`.
5. Table: `contact_messages`.
6. Events: `INSERT` only.
7. Type: `Supabase Edge Function`.
8. Edge Function: Select `send-contact-email`.
9. Method: `POST`.
10. Timeout: `1000ms`.
11. Click "Create Webhook".

IMPORTANT: Make sure to set `RESEND_API_KEY` in Supabase Dashboard -> Edge Functions -> send-contact-email -> Settings -> Secrets.
*/
