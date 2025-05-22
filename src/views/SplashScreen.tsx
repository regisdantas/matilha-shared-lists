import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';

export const SplashScreen = () => {
  const {user} = useAuth();
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
        <Wolf source={require('../assets/wolf.png')}/>
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

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-top: 12px;
`;

const Wolf = styled.Image`
  position: absolute;
  flex: 1;
  top: 30px;
  left: calc(50% - 150px);
  z-index: 1;
  width: 300px;
  height: 300px;
  display: flex;
  opacity: 20%;
`