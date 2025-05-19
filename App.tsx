import React from 'react';
import { GlobalStyles } from './styles/global';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { shade } from 'polished';
import { AuthContextProvider } from "./contexts/authContext"

import * as Font from 'expo-font';

// Views
import { SplashScreen } from './views/SplashScreen';
import { LoginScreen } from './views/LoginScreen';
import { DashboardScreen } from './views/DashboardScreen';


export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    Font.loadAsync({
      'werewolf': require('./assets/fonts/werewolf.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthContextProvider>
      <AppContainer>
        <StatusBar style="dark" />
        {/* <Header title="Matilha"/> */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <GlobalStyles />
      </AppContainer>
    </AuthContextProvider>
  );
}

export const AppContainer = styled.View`
  min-height: 90vh;
  max-width: 430px;
  width: 430px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #cfdfe9;
`;
