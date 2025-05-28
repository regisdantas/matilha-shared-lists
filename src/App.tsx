import React from 'react';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/global';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { ThemeProvider } from 'styled-components/native';
import { AuthContextProvider } from "./context/AuthContext";
import { Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { SplashScreen } from './views/SplashScreen';
import { LoginScreen } from './views/LoginScreen';
import { DashboardScreen } from './views/DashboardScreen';
import { MatilhasScreen } from './views/MatilhasScreen';
import { UserProvider } from './context/UserContext';

const screenHeight = Dimensions.get('window').height;

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  Matilhas: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    Font.loadAsync({
      'werewolf': require('../assets/fonts/werewolf.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthContextProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <StatusBar backgroundColor="#F9F9F9" />
          <AppContainer>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="Matilhas" component={MatilhasScreen} />
              </Stack.Navigator>
            </NavigationContainer>
            <GlobalStyles />
          </AppContainer>
        </ThemeProvider>
      </UserProvider>
    </AuthContextProvider>
  );
}

export const AppContainer = styled.View`
  min-height: ${screenHeight * 0.9}px;
  width: 900px;
  max-width: 900px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  background-color: #cfdfe9;
`;
