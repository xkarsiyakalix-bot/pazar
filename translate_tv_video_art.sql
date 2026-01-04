-- Fix TV & Video Filter Values

-- Translate Filter Values (tv_video_art) to Turkish
UPDATE listings
SET tv_video_art = CASE
    WHEN tv_video_art = 'Fernseher' THEN 'Televizyonlar'
    WHEN tv_video_art = 'TV-Receiver' THEN 'TV Alıcıları'
    WHEN tv_video_art = 'DVD-Player & Recorder' THEN 'DVD Oynatıcı & Kaydedici'
    WHEN tv_video_art = 'Weitere TV & Video' THEN 'Diğer TV & Video'
    
    -- Fix my potential previous manual entries if any
    WHEN tv_video_art = 'Televizyon' THEN 'Televizyonlar'
    WHEN tv_video_art = 'TV Alıcısı' THEN 'TV Alıcıları'
    ELSE tv_video_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'TV & Video'
  AND tv_video_art IN (
    'Fernseher', 'TV-Receiver', 'DVD-Player & Recorder', 'Weitere TV & Video',
    'Televizyon', 'TV Alıcısı'
  );

-- Verify updates
SELECT tv_video_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'TV & Video'
GROUP BY tv_video_art;
