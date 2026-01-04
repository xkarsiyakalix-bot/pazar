#!/usr/bin/env python3
"""
Add CategoryGallery component to components.js and update all category pages
"""

import os
import re

# Component code to add
category_gallery_component = '''
// Category-specific Gallery Component
export const CategoryGallery = ({ category, subCategory, toggleFavorite, isFavorite }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const itemsPerView = 5;

  useEffect(() => {
    // Filter TOP listings by category and subcategory
    let topListings = mockListings.filter(listing => listing.isTop === true);
    
    if (category) {
      topListings = topListings.filter(listing => listing.category === category);
    }
    
    if (subCategory) {
      topListings = topListings.filter(listing => listing.subCategory === subCategory);
    }
    
    const shuffled = [...topListings].sort(() => 0.5 - Math.random());
    setGalleryItems(shuffled.slice(0, 10));
  }, [category, subCategory]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (galleryItems.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Top-Anzeigen</h2>
        <div className="flex items-center gap-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors">
            Anzeige hier platzieren
          </a>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Previous items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Next items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-3"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {galleryItems.map((item) => (
            <div key={item.id} className="gallery-item w-[calc(20%-9.6px)] flex-shrink-0">
              <ListingCard
                listing={item}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
'''

print("📦 Adding CategoryGallery component to components.js...")
print("=" * 60)

components_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src/components.js'

# Read components.js
with open(components_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the Gallery component and add CategoryGallery after it
gallery_end = content.find('};', content.find('export const Gallery'))
if gallery_end != -1:
    # Find the next line after Gallery component
    insert_pos = content.find('\n', gallery_end) + 1
    
    # Insert CategoryGallery component
    new_content = content[:insert_pos] + '\n' + category_gallery_component + '\n' + content[insert_pos:]
    
    with open(components_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ CategoryGallery component added to components.js")
else:
    print("❌ Could not find Gallery component")

print("\n" + "=" * 60)
print("✅ Component addition complete!")
