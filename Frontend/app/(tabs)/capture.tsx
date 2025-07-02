import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Camera, RotateCcw } from 'lucide-react-native';
import { usePhoto } from '../PhotoContext';
import commonStyles from './styles/common';
import captureStyles from './styles/capture';

export default function TakePhoto() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { setPhoto } = usePhoto();

  if (!permission) {
    return (
      <View style={commonStyles.container}>
        <View>
          <Text style={commonStyles.text}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={commonStyles.container}>
        <View>
          <Camera size={64} color="#9ca3af" strokeWidth={1.5} />
          <Text style={commonStyles.title}>Camera Access Required</Text>
          <Text style={commonStyles.text}>
            We need camera access to analyze your moles. Your photos are processed securely and privately.
          </Text>
          <TouchableOpacity onPress={requestPermission}>
            <Text style={commonStyles.text}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      setPhoto(photo);
      router.push('/report');
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <>
      <View style={captureStyles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={captureStyles.camera}
          facing={facing}
          animateShutter={false}
        >
          <View style={captureStyles.overlay}>
            <View style={captureStyles.targetCircle}>
              <View style={captureStyles.innerCircle} />
            </View>
          </View>
        </CameraView>
      </View>

      <View style={captureStyles.controls}>
        <TouchableOpacity style={captureStyles.secondaryButton} onPress={toggleCameraFacing}>
          <RotateCcw size={24} color="#6b7280" strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[captureStyles.captureButton, isCapturing && captureStyles.captureButtonDisabled]}
          onPress={takePicture}
          disabled={isCapturing}
        >
          <View style={captureStyles.captureButtonInner}>
            <Camera size={32} color="#888" strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
} 