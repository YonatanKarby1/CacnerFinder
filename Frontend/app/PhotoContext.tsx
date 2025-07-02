import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CameraCapturedPicture } from 'expo-camera';

interface PhotoContextType {
  photo: CameraCapturedPicture | null;
  setPhoto: (photo: CameraCapturedPicture | null) => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhoto = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhoto must be used within a PhotoProvider');
  }
  return context;
};

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  return (
    <PhotoContext.Provider value={{ photo, setPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}; 