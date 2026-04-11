import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import NameCard from '../../components/NameCard';
import SocialsCard, { SocialValues } from '../../components/SocialsCard';
import AddProfileCard from '~/src/components/AddProfile';
import { NameCardType } from '~/types/types';
import { buildProfilePayload } from '~/src/utils/buildProfilePayload';
import { uploadOnboarding } from '~/src/utils/uploadOnboarding';
import { useAuth } from '~/src/context/AuthProvider';

export default function OnboardingScreen() {
  const { setProfile } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [nameData, setNameData] = useState<NameCardType>();
  const [socialsData, setSocialsData] = useState<SocialValues>();
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 3;

  const handleFinish = async (uri?: string) => {
    setSubmitting(true);
    const payload = buildProfilePayload(nameData, socialsData, uri);
    const { profile, error } = await uploadOnboarding(payload);
    setSubmitting(false);

    if (error || !profile) {
      const msg = error?.message ?? JSON.stringify(error) ?? 'Failed to create profile';
      console.error('Onboarding error:', error);
      Alert.alert('Onboarding Error', msg);
      return;
    }

    setProfile(profile);
  };

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      {/* Decorative top-right image */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        resizeMode="contain"
        className="absolute -right-10 -top-32 h-[500px] w-[400px]"
        style={{ transform: [{ translateX: 120 }, { translateY: 24 }, { rotate: '-20deg' }], opacity: 0.15 }}
      />
      {/* Decorative bottom-left image */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        resizeMode="contain"
        className="absolute -bottom-40 -left-32 h-[500px] w-[400px]"
        style={{ transform: [{ rotate: '12deg' }, { translateX: -90 }, { translateY: -120 }], opacity: 0.15 }}
      />

      <View className="flex-1 justify-center px-5">
        {stepIndex === 0 && (
          <NameCard
            currentStep={1}
            totalSteps={totalSteps}
            initialName={nameData?.name ?? ''}
            initialBio={nameData?.bio ?? ''}
            onContinue={(data) => {
              setNameData(data);
              setStepIndex(1);
            }}
          />
        )}

        {stepIndex === 1 && (
          <SocialsCard
            currentStep={2}
            totalSteps={totalSteps}
            initial={socialsData ?? ({} as SocialValues)}
            onBack={() => setStepIndex(0)}
            onContinue={(data) => {
              setSocialsData(data);
              setStepIndex(2);
            }}
          />
        )}

        {stepIndex === 2 && (
          <AddProfileCard
            currentStep={3}
            totalSteps={totalSteps}
            onBack={() => setStepIndex(1)}
            onContinue={(uri) => {
              handleFinish(uri);
            }}
          />
        )}
      </View>
    </View>
  );
}
