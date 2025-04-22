
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNativeFeatures } from '@/hooks/useNativeFeatures';
import { Camera, MapPin, Save, Smartphone } from 'lucide-react';

const NativeFeatures = () => {
  const {
    takePicture,
    getCurrentLocation,
    saveFile,
    getDeviceInfo,
    location,
    imageUrl
  } = useNativeFeatures();

  const handleSaveLocation = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      await saveFile(
        JSON.stringify(loc),
        'location.json'
      );
    }
  };

  const handleDeviceInfo = async () => {
    const info = await getDeviceInfo();
    if (info) {
      await saveFile(
        JSON.stringify(info),
        'device-info.json'
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={takePicture}>
          <Camera className="mr-2 h-4 w-4" />
          Take Picture
        </Button>
        <Button onClick={getCurrentLocation}>
          <MapPin className="mr-2 h-4 w-4" />
          Get Location
        </Button>
        <Button onClick={handleSaveLocation}>
          <Save className="mr-2 h-4 w-4" />
          Save Location
        </Button>
        <Button onClick={handleDeviceInfo}>
          <Smartphone className="mr-2 h-4 w-4" />
          Device Info
        </Button>
      </div>

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Captured" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      {location && (
        <div className="mt-4 p-4 bg-secondary rounded-lg">
          <h3 className="font-semibold">Current Location:</h3>
          <p>Latitude: {location.coords.latitude}</p>
          <p>Longitude: {location.coords.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default NativeFeatures;
