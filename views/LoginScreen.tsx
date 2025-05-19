import React from 'react';
import styled, {css} from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { shade } from 'polished';
import {UserAuth} from '../contexts/authContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Header } from "../components/Header"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen = () => {
  const {user, signInWithGoogle, signInWithFacebook} = UserAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLoginEmail = () => {}

  const handleGoogleSignIn = async () => {
    try{
      await signInWithGoogle();
    } catch (error)  {
      console.log(error);
      // setInputStatus({type: "error", fields: "email", message: (error instanceof Error)?error.message:"Unknown error"});
    }
  }

  const handleFacebookSignIn = async () => {
    try{
      await signInWithFacebook();
    } catch (error)  {
      console.log(error);
      // setInputStatus({type: "error", fields: "email", message: (error instanceof Error)?error.message:"Unknown error"});
    }
  }

  React.useEffect(() => {
    if (user !== null && user.displayName !== undefined) {
      console.log(user)
      navigation.navigate('Dashboard' as never);
    }
  }, [user]);

  return (
    <BodyContainer>
      <Header></Header>
      <LoginForm>
        <Input placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" />
        <Input placeholder="Senha" placeholderTextColor="#aaa" secureTextEntry />

        <LoginButton color={"#04d361"} onPress={handleGoogleSignIn}>
          <MaterialIcons name="email" size={24} color="white" />
          <LoginText>Entrar com E-mail</LoginText>
        </LoginButton>
        <LoginButton color={"#DB4437"} onPress={handleGoogleSignIn}>
          <FontAwesome name="google" size={24} color="white" /> 
          <LoginText>Entre com Google</LoginText>
        </LoginButton>
        <LoginButton color={"#4a90e2"} onPress={handleGoogleSignIn}>
          <FontAwesome5 name="facebook" size={24} color="white" />
          <LoginText>Entre com Facebook</LoginText>
        </LoginButton>

      </LoginForm>
      <Matilha source={require('../assets/matilha.png')}/>
      <BotBar/>
    </BodyContainer>
  );
};

// Styled Components
const LoginForm = styled.View`
  margin-top: 100px;
`
const Input = styled.TextInput`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  color: black;
  max-width: 400px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid black;
`;

const LoginText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  self-align: center;
`;

interface CustomButtonProps {
  color: string;
}

const LoginButton = styled.TouchableOpacity<CustomButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  height: 50px;

  ${props =>
    props.color &&
    css`
      background-color: ${props.color} !important;
      &:hover {
        background-color: ${shade(0.2, props.color)} !important;
      }
    `}

`;

const BodyContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background: #cfdfe9;
`;

const Matilha = styled.Image`
  position: absolute;
  flex: 1;
  bottom: 30px;
  left: calc(50% - 110px);
  z-index: -1;
  width: 220px;
  height: 150px;
  display: flex;
  opacity: 20%;
`

const BotBar = styled.View`
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 7px;
  background: rgb(60, 60, 60);
  color: white;
  height: 30px;
  width: 100%;
`