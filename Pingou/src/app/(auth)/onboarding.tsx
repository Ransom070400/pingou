import React, { useState } from 'react';
// Import core RN primitives actually used
import { View, Image } from 'react-native';
// Import step components (each encapsulates its own UI + logic)
import NameCard from '../../components/NameCard';
import SocialsCard, { SocialValues } from '../../components/SocialsCard';
import AddProfileCard from '~/src/components/AddProfile';
import { NameCardType } from '~/types/types';
import { buildProfilePayload } from '~/src/utils/buildProfilePayload';  
import { uploadOnboarding } from '~/src/utils/uploadOnboarding';


// Export the screen component (Expo Router will load this by filename)
export default function OnboardingScreen() {
  // stepIndex tracks which step to show (0 = name, 1 = socials)
  const [stepIndex, setStepIndex] = useState(0);

  // Collected data from Name step (kept so user can go Back without losing input)
  const [nameData, setNameData] = useState<NameCardType>();

  // Collected data from Socials step (same idea)
  const [socialsData, setSocialsData] = useState<SocialValues>();

  const [imageUri, setImageUri] = useState<string>();


 const finalPayload = buildProfilePayload(nameData, socialsData, imageUri);

  // Total number of onboarding steps (used for segmented progress)
  const totalSteps = 3;

  return (
    // Root container: fills screen + background color
    <View className="flex-1 bg-neutral-100">
      {/* Decorative top-right image (absolute removes it from normal flex layout) */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        resizeMode="contain"
        className="absolute -right-10 -top-32 h-[500px] w-[400px]"
        // Inline style for transforms (NativeWind does not generate dynamic transform utilities)
        style={{ transform: [{ translateX: 120 }, { translateY: 24 }, { rotate: '-20deg' }] }}
      />
      {/* Decorative bottom-left image */}
      <Image
        source={require('../../../assets/PingouLogoWOBG.png')}
        resizeMode="contain"
        className="absolute -bottom-40 -left-32 h-[500px] w-[400px]"
        style={{ transform: [{ rotate: '12deg' }, { translateX: -90 }, { translateY: -120 }] }}
      />

      {/* Foreground layer that centers active card */}
      <View className="flex-1 justify-center px-5">
        {/* Conditional render of step 0 (Name) */}
        {stepIndex === 0 && (
          <NameCard
            currentStep={1}
            totalSteps={totalSteps}
            initialName={nameData?.name ?? ''} // avoid crash if undefined
            initialBio={nameData?.bio ?? ''}
            // When user clicks Continue in NameCard
            onContinue={(data) => {
              setNameData(data); // persist name + bio
              setStepIndex(1); // move to next step
            }}
          />
        )}

        {/* Conditional render of step 1 (Socials) */}
        {stepIndex === 1 && (
          <SocialsCard
            currentStep={2}
            totalSteps={totalSteps}
            initial={socialsData ?? ({} as SocialValues)}
            onBack={() => setStepIndex(0)} // allow returning to edit name/bio
            onContinue={(data) => {
              setSocialsData(data); // store socials
              setStepIndex(2);
              // Optional: see the partial payload so far (name + socials)
              const partialPayload = buildProfilePayload(nameData, data, imageUri);
              console.log('Partial Onboarding Payload:', partialPayload);
            }}
          />
        )}

        {/* Conditional render of step 2 (Add Profile Image) */}
        {stepIndex === 2 && (
          <AddProfileCard
            currentStep={3}
            totalSteps={totalSteps}
            onBack={() => setStepIndex(1)} // allow returning to edit socials
            onContinue={(uri) => {
              setImageUri(uri);
              const finalPayload = buildProfilePayload(nameData, socialsData, uri);
              console.log('Final Onboarding Payload:', finalPayload);
              // TODO: submit finalPayload or navigate
              // router.replace('/(tabs)')
            }}
          />
        )}
      </View>
    </View>
  );
}
