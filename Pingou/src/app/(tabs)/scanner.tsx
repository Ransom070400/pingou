import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { QrCode } from 'lucide-react-native';
import { Feedback } from '~/src/utils/Feedback';


const scanner = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<BarcodeScanningResult | null>(null);

  
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
  if (scannedData) return;
    setScannedData(result);
    Feedback.success()
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex-1 bg-white items-center justify-center'>
        <Text className='text-black'>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }


  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1, width: '100%' }} facing={facing}
      onBarcodeScanned={handleBarCodeScanned}
      >
         {/* Header overlay with scan instructions */}
        <View className='absolute top-16 mt-[60px] left-0 right-0 items-center z-10'>
          <Text className='text-white text-2xl font-bold mb-2'>
            Scan QR code to connect
          </Text>
          <Text className='text-white/80 text-base'>
            Position QR code within frame
          </Text>
        </View>
        
        {/* Centered QR code frame indicator */}
        <View className='absolute inset-0 items-center justify-center'>
          <QrCode size={200} color="rgba(255,255,255,0.6)" />
        </View>
      </CameraView>
    </View>
  )
}

export default scanner