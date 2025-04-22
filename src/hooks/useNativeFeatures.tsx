
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { useToast } from '@/components/ui/use-toast';

export const useNativeFeatures = () => {
  const [location, setLocation] = useState<Position | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      setImageUrl(image.webPath || null);
      return image.webPath;
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive"
      });
      return null;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setLocation(position);
      return position;
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Unable to get location",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveFile = async (data: string, fileName: string) => {
    try {
      const result = await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Documents
      });
      toast({
        title: "Success",
        description: "File saved successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "File Error",
        description: "Unable to save file",
        variant: "destructive"
      });
      return null;
    }
  };

  const getDeviceInfo = async () => {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      toast({
        title: "Device Error",
        description: "Unable to get device info",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    takePicture,
    getCurrentLocation,
    saveFile,
    getDeviceInfo,
    location,
    imageUrl
  };
};
