
-- Insert a test listing for Pet Care to verify visibility
INSERT INTO listings (
    user_id,
    title,
    description,
    price,
    category,
    sub_category,
    city,
    postal_code,
    federal_state,
    offer_type,
    seller_type,
    status
) 
SELECT
    id as user_id,
    'Profesyonel Köpek Eğitimi',
    'Deneyimli eğitmenden pozitif eğitim hizmeti. İstanbul içi yerinde eğitim.',
    1500,
    'Hizmetler',
    'Evcil Hayvan Bakımı & Eğitim',
    'İstanbul',
    '34000',
    'İstanbul',
    'Angebote',
    'Privatnutzer',
    'active'
FROM auth.users
LIMIT 1;
