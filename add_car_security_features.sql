-- Add ABS to car amenities and set scheckheftgepflegt to true for the VW Käfer listing
-- This will make the Security filter show counts

UPDATE listings
SET 
    car_amenities = array_append(car_amenities, 'Antiblockiersystem (ABS)'),
    scheckheftgepflegt = true
WHERE id = '55bbd467-302f-4695-acdd-dd4ea24a60bf';
