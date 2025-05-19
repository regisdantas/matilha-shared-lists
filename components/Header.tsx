import React from 'react';
import { ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {UserAuth} from '../contexts/authContext';

export const Header = () => {
  const familias = ['Dantas', 'Lara Dantas'];
  const {user, logOut} = UserAuth();
  return(
    <HeaderContainer>
    <Wolf source={require('../assets/wolf.png')}/>
      <TopBar>
        <TitleText style={{color: "white"}}>Bem-vindo</TitleText>
      </TopBar>
      <MainHeader>
        <TitleAppName>Matilha</TitleAppName>
      </MainHeader>
      <FamilyBar>
        {(user !== null && user.displayName !== undefined)?( 
            <>
                <HorizontalScroll horizontal showsHorizontalScrollIndicator={false}>
                <FamilyPill key="add" numberOfLines={1}>
                    🐾 Matilhas
                </FamilyPill>
                <FamilyPill key="favoritos" isActive>
                    ⭐ Favoritos
                </FamilyPill>
                {familias.map((familia) => (
                    <FamilyPill key={familia}>👥 {familia}</FamilyPill>
                ))}
                </HorizontalScroll>
                <FamilyPill onPress={() => logOut()}>
                <Ionicons style={{alignSelf: "center"}} name="exit-outline" size={24} color="black" />
                </FamilyPill>
            </>
        ):(<></>)}
      </FamilyBar>
      </HeaderContainer>
    );
}

const HeaderContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  background:  #cfdfe9 ;
  margin: 0px;
`;

const TopBar = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 7px;
  background: #3c3c3c;
  color: white;
  height: 30px;
  width: 100%;
  self-align: center;
  align-items: center;
`

const MainHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 22px;
  width: 100%;
  height: 34px;
  background: #FBC531;
  align-items: center;
`;

const TitleAppName = styled.Text`
  display: flex;
  justify-content: space-between;
  font-size: 42px;
  font-weight: bold;
  color: rgb(60, 60, 60);
  padding-left: 30px;
  z-index: 5 !important;
  font-size: 43px;
  font-weight: bold;
  font-family: impact;
  letter-spacing: 20px;
  color: #3c3c3c;
  align-items: center;
  self-align: center;
  text-transform: uppercase;
`;

const FamilyBar = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 42px;
  background: rgb(60, 60, 60);
  z-index: 6;
  padding-vertical: 3px;
`;

const HorizontalScroll = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
  border-radius: -30px;
`;

const FamilyPill = styled.Text<{ isActive?: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isActive ? '#4a90e2' : '#eee')};
  color: ${(props) => (props.isActive ? '#fff' : '#333')};
  padding: 10px;
  margin: 4px;
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 30px;
  font-weight: 600;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: auto;
  min-width: 0;
    flex-shrink: 1;
    flex-grow: 1;
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

const Logo = styled.Image`
  display: flex;
  height: 80px;
  width: 74px;
`

// === TEXTOS ===
const TitleText = styled.Text`
  font-size: 16px;
  color: rgb(60, 60, 60);
  font-weight: bolder;
  justify-content: center;
`;

const TitleBox = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`

const UserBox = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #666;
  padding-left: 6px;
`;
