SELECT count(*) as count, sub_category FROM listings WHERE category = 'Emlak' GROUP BY sub_category;
