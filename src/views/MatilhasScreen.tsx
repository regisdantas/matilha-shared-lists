import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';

export const MatilhasScreen = () => {
  const {user} = useAuth();
  const opacity = new Animated.Value(0);
  const navigation = useNavigation();

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
