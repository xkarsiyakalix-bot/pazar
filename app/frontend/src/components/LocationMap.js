import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMap = ({ city, district, address }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [precision, setPrecision] = useState('city'); // 'exact', 'district', or 'city'

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!city) {
        setLoading(false);
        return;
      }

      // Helper to clean common Turkish address noise that confuses geocoders (apartment, floor, building details)
      const cleanAddress = (rawAddr) => {
        if (!rawAddr) return '';
        return rawAddr
          .replace(/(no|No|NO|n|N)\s*:\s*\d+/g, '') // remove No: 12
          .replace(/(kat|Kat|KAT)\s*\d+/g, '') // remove Kat 3
          .replace(/(daire|Daire|DAİRE|d|D)\s*\d+/g, '') // remove Daire 5
          .replace(/(apt|Apt|APT|apartmanı|Apartmanı|APARTMANI|sitesi|Sitesi|SİTESİ|blok|Blok|BLOK)/gi, '') // remove building/site names
          .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s,]/g, '') // remove special symbols except comma
          .replace(/\s+/g, ' ')
          .trim();
      };

      const cleanedAddr = cleanAddress(address);

      // Define our search strategies in order of high precision to low precision
      const searchStrategies = [];

      // 1. Exact cleaned street address + district + city (Highly Precise)
      if (cleanedAddr && district) {
        searchStrategies.push({
          query: `${cleanedAddr}, ${district}, ${city}, Turkey`,
          precision: 'exact'
        });
      }

      // 2. Exact cleaned street address + city (Precise)
      if (cleanedAddr) {
        searchStrategies.push({
          query: `${cleanedAddr}, ${city}, Turkey`,
          precision: 'exact'
        });
      }

      // 3. District + City (Medium Precision - District Center)
      if (district) {
        searchStrategies.push({
          query: `${district}, ${city}, Turkey`,
          precision: 'district'
        });
      }

      // 4. Just City (Low Precision - City Center)
      searchStrategies.push({
        query: `${city}, Turkey`,
        precision: 'city'
      });

      // Try geocoding strategies sequentially until one succeeds
      let foundPosition = null;
      let foundPrecision = 'city';

      for (const strategy of searchStrategies) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(strategy.query)}&limit=1`,
            {
              headers: {
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'User-Agent': 'ExVitrinApp/1.0'
              }
            }
          );
          const data = await response.json();
          
          if (data && data.length > 0) {
            foundPosition = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            foundPrecision = strategy.precision;
            break; // Match found! Stop search
          }
        } catch (error) {
          console.error(`Geocoding failed for: ${strategy.query}`, error);
        }
      }

      if (foundPosition) {
        setPosition(foundPosition);
        setPrecision(foundPrecision);
      }
      setLoading(false);
    };

    fetchCoordinates();
  }, [city, district, address]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-neutral-800 rounded-lg animate-pulse flex items-center justify-center border border-gray-200 dark:border-white/5">
        <span className="text-gray-400 dark:text-neutral-500 font-medium">Harita Yükleniyor...</span>
      </div>
    );
  }

  if (!position) {
    return null;
  }

  // Determine zoom level and representation based on geocoding precision
  const isExactMatch = precision === 'exact';
  const isDistrictMatch = precision === 'district';

  return (
    <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm relative z-0">
      <MapContainer 
        center={position} 
        zoom={isExactMatch ? 15 : isDistrictMatch ? 13 : 11} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {isExactMatch ? (
          <Marker position={position}>
            <Popup>
              <div className="text-sm font-semibold">İlan Adresi</div>
              <div className="text-xs text-gray-600 mt-0.5">{address}, {district ? district + ', ' : ''}{city}</div>
            </Popup>
          </Marker>
        ) : isDistrictMatch ? (
          <Marker position={position}>
            <Popup>
              <div className="text-sm font-semibold">Konum: {district}</div>
              <div className="text-xs text-gray-600 mt-0.5">{city}</div>
            </Popup>
          </Marker>
        ) : (
          <Circle 
            center={position} 
            pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.15 }} 
            radius={2500} 
          >
            <Popup>
              <div className="text-sm font-semibold">Yaklaşık Bölge: {city}</div>
              <div className="text-xs text-gray-600 mt-0.5">Net adres belirtilmemiştir.</div>
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
