import React, { useState } from 'react'
import { View } from 'react-native'
// Import the reusable NameCard component from components folder
import NameCard from '~/src/components/NameCard'

/* 
  Rename the local screen component so it doesn't conflict with the imported NameCard.
  Keeping names unique avoids the "Import declaration conflicts with local declaration" TS error.
*/
export default function OnboardingScreen() {
  // Local state for form values; we keep them here so we can pass initial values into NameCard.
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  // Handler called when the NameCard's Continue is pressed.
  const handleContinue = (payload: { name: string; bio: string }) => {
    // Update local state with values from the card
    setName(payload.name)
    setBio(payload.bio)

    // TODO: navigate to next screen (e.g., using router.push('/(auth)/socials'))
  }

  return (
    // Screen layout: center the card in the view
    <View className="flex-1 bg-neutral-100">
      <View className="flex-1 justify-center px-5">
        {/* Render the imported NameCard component and pass handlers/state */}
        <NameCard initialName={name} initialBio={bio} onContinue={handleContinue} />
      </View>
    </View>
  )
}