import { View, Text, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { QrCode } from 'lucide-react-native';
import { Feedback } from '~/src/utils/Feedback';
import { supabase } from '~/src/lib/supabase';
import { useAuth } from '~/src/context/AuthProvider';
import { ProfileType } from '~/src/types/ProfileTypes';
import { router } from 'expo-router';

const Scanner = () => {
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<BarcodeScanningResult | null>(null);
  const { session } = useAuth();

  if (!permission) {
    return <View />;
  }

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scannedData) return;
    setScannedData(result);
    Feedback.success();

    const scannedUserId = result.data;

    if (!session?.user?.id) {
      Alert.alert('Error', 'You must be logged in to connect');
      setScannedData(null);
      return;
    }

    if (scannedUserId === session.user.id) {
      Alert.alert('Oops', "You can't connect with yourself!");
      setScannedData(null);
      return;
    }

    // Look up the scanned user's profile
    const { data: scannedProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', scannedUserId)
      .single();

    if (profileError || !scannedProfile) {
      Alert.alert('Not Found', 'Could not find that user');
      setScannedData(null);
      return;
    }

    const profile = scannedProfile as ProfileType;

    // Create mutual connections (both directions)
    const { error: connError } = await supabase.from('connections').upsert(
      [
        { owner_id: session.user.id, connected_to: scannedUserId },
        { owner_id: scannedUserId, connected_to: session.user.id },
      ],
      { onConflict: 'owner_id,connected_to', ignoreDuplicates: true }
    );

    if (connError) {
      Alert.alert('Error', connError.message);
    } else {
      Feedback.success();
      Alert.alert(
        'Connected!',
        `You and ${profile.fullname} are now connected`,
        [
          { text: 'OK', onPress: () => {} },
          {
            text: 'View Profile',
            onPress: () => router.push({ pathname: '/connectionDetail', params: { userId: scannedUserId } }),
          },
        ]
      );
    }

    setScannedData(null);
  };

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-black">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1, width: '100%' }}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned}>
        {/* Header overlay */}
        <View className="absolute left-0 right-0 top-16 z-10 mt-[60px] items-center">
          <Text className="mb-2 text-2xl font-bold text-white">Scan QR code to connect</Text>
          <Text className="text-base text-white/80">Position QR code within frame</Text>
        </View>

        {/* Centered QR frame */}
        <View className="absolute inset-0 items-center justify-center">
          <QrCode size={200} color="rgba(255,255,255,0.6)" />
        </View>
      </CameraView>
    </View>
  );
};

export default Scanner;
