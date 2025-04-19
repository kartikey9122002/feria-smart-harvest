
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MapProps {
  onLocationSelect?: (coordinates: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  readOnly?: boolean;
}

const Map = ({ onLocationSelect, initialLocation, readOnly = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const initializeMap = () => {
      if (!mapContainer.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialLocation || [78.9629, 20.5937], // India center
        zoom: initialLocation ? 12 : 4
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      if (initialLocation) {
        marker.current = new mapboxgl.Marker()
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(map.current);
      }

      if (!readOnly) {
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          
          if (marker.current) {
            marker.current.setLngLat([lng, lat]);
          } else {
            marker.current = new mapboxgl.Marker()
              .setLngLat([lng, lat])
              .addTo(map.current!);
          }

          onLocationSelect?.({ lat, lng });
        });
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, initialLocation, onLocationSelect, readOnly]);

  if (showTokenInput) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Enter your Mapbox public token</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setShowTokenInput(false)}
          disabled={!mapboxToken}
        >
          Set Token
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
