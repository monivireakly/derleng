import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Colors } from './src/theme/colors';
import { TopAppBar } from './src/components/TopAppBar';
import { BottomTabBar, TabName } from './src/components/BottomTabBar';
import { Sidebar } from './src/components/Sidebar';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchResultsScreen } from './src/screens/SearchResultsScreen';
import { MyTripsScreen } from './src/screens/MyTripsScreen';
import { PurchasesScreen } from './src/screens/PurchasesScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { ProviderMiniAppScreen } from './src/screens/ProviderMiniAppScreen';
import { TicketSuccessScreen } from './src/screens/TicketSuccessScreen';
import { ETicketScreen } from './src/screens/ETicketScreen';
import { ServiceSearchScreen } from './src/screens/ServiceSearchScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

// Module-level flag: shows onboarding once per app session.
// Replace with AsyncStorage persistence when ready for production.
let _onboardingDone = false;

export type RootStackParamList = {
  Main: { tab?: TabName } | undefined;
  ServiceSearch: { service: 'bus' | 'flight' | 'hotel' };
  SearchResults: { from: string; to: string; date: string };
  ProviderMiniApp: { result: any };
  TicketSuccess: { passengerName?: string; email?: string; seat?: string; result?: any };
  ETicket: { trip: any };
  Login: undefined;
  Signup: undefined;
};

const AppStack = createNativeStackNavigator<RootStackParamList>();

const TAB_LABELS: Record<TabName, string> = {
  Explore:  'DerLeng',
  MyTrips:  'My Trips',
  Tickets:  'Bookings',
  Profile:  'Profile',
};

function MainScreen({ navigation, route }: { navigation: any; route: any }) {
  const initialTab = route?.params?.tab as TabName | undefined;
  const [activeTab, setActiveTab] = useState<TabName>(initialTab ?? 'Explore');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'Explore': return <HomeScreen navigation={navigation} />;
      case 'MyTrips': return <MyTripsScreen navigation={navigation} />;
      case 'Tickets': return <PurchasesScreen navigation={navigation} />;
      case 'Profile': return <UserProfileScreen />;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TopAppBar
        title={TAB_LABELS[activeTab]}
        onMenuPress={() => setSidebarOpen(true)}
      />
      {renderScreen()}
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        onClose={() => setSidebarOpen(false)}
        onNavigate={setActiveTab}
      />
    </View>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <AppStack.Screen name="Main"            component={MainScreen} />
      <AppStack.Screen name="ServiceSearch"   component={ServiceSearchScreen} />
      <AppStack.Screen name="SearchResults"   component={SearchResultsScreen} />
      <AppStack.Screen name="ProviderMiniApp" component={ProviderMiniAppScreen} />
      <AppStack.Screen name="TicketSuccess"   component={TicketSuccessScreen}   options={{ animation: 'fade', gestureEnabled: false }} />
      <AppStack.Screen name="ETicket"         component={ETicketScreen}         options={{ animation: 'slide_from_bottom' }} />
      <AppStack.Screen name="Login"           component={LoginScreen}           options={{ animation: 'slide_from_bottom' }} />
      <AppStack.Screen name="Signup"          component={SignupScreen}          options={{ animation: 'slide_from_bottom' }} />
    </AppStack.Navigator>
  );
}

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(_onboardingDone);

  const handleOnboardingDone = () => {
    _onboardingDone = true;
    setOnboardingDone(true);
  };

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!onboardingDone) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingScreen onDone={handleOnboardingDone} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  mainContainer: { flex: 1, backgroundColor: Colors.surface },
});
