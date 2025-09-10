import '../../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { useColorScheme, View, ActivityIndicator,Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthProvider';



export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { profile, session, loading } = useAuth();

   // If auth is loading, show a centered placeholder (simple splash).
  if (loading) {
    return (
      // Full screen container centered for the placeholder.
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
        {/* Optional logo image for splash; adjust path if needed. */}
        <Image
          source={require('../../assets/PingouLogoWOBG.png')}
          style={{ width: 120, height: 160, marginBottom: 16 }}
          resizeMode="contain"
        />
        {/* Native ActivityIndicator to show progress */}
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  const colorScheme = useColorScheme();
  return (
     <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
    </ThemeProvider>
  </GestureHandlerRootView>
    </AuthProvider>
);
}
