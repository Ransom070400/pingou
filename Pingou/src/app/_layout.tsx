import '../../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { useColorScheme, View, ActivityIndicator,Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthProvider';
import LoadingPenguins from '../components/LoadingPenguins';


export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {


  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}


function RootLayoutNav(){
    const colorScheme = useColorScheme();
          const { profile, session, loading } = useAuth();
         // If auth is loading, show a centered placeholder (simple splash)

         const load = true
  if (load) { // loading
    return <LoadingPenguins penguinSize={160} size={460} penguinSource={require('../../assets/PingouLogoWOBG.png')} />;
  }
      return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
        <Stack.Protected guard={!session}> //!session
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
    </ThemeProvider>
  </GestureHandlerRootView>
);
}