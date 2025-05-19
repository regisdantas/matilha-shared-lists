import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {UserAuth} from '../contexts/authContext';

export const SplashScreen = () => {
  const {user} = UserAuth();
  const opacity = new Animated.Value(0);
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        navigation.navigate('Login' as never);
      }, 1000);
    });
  }, []);

  React.useEffect(() => {
    if (user !== null && user.displayName !== undefined) {
      navigation.navigate('Dashboard' as never);
    }
  }, [user]);

  return (
    <Container>
      <AnimatedLogo style={{ opacity }}>
        <Logo>🐾</Logo>
        <Title>Matilha</Title>
      </AnimatedLogo>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const AnimatedLogo = styled(Animated.View)`
  align-items: center;
`;

const Logo = styled.Text`
  font-size: 64px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-top: 12px;
`;
