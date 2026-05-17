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

const LocationMap = ({ city, address }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!city) {
        setLoading(false);
        return;
      }

      try {
        const query = encodeURIComponent(`${address ? address + ', ' : ''}${city}, Turkey`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
          headers: {
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'ExVitrinApp/1.0'
          }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else if (address) {
          // Fallback to just city if address + city fails
          const cityQuery = encodeURIComponent(`${city}, Turkey`);
          const cityResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&limit=1`);
          const cityData = await cityResponse.json();
          if (cityData && cityData.length > 0) {
            setPosition([parseFloat(cityData[0].lat), parseFloat(cityData[0].lon)]);
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [city, address]);

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

  // If we only have city, show a circle (approximate location). If we have address, show a marker.
  const showExactMarker = !!address;

  return (
    <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm relative z-0">
      <MapContainer 
        center={position} 
        zoom={showExactMarker ? 14 : 11} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {showExactMarker ? (
          <Marker position={position}>
            <Popup>
              {address}, {city}
            </Popup>
          </Marker>
        ) : (
          <Circle 
            center={position} 
            pathOptions={{ fillColor: '#ef4444', color: '#ef4444' }} 
            radius={2000} 
          >
            <Popup>
              Yaklaşık Konum: {city}
            </Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
