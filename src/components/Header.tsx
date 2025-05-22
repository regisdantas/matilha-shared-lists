import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useAuth} from '../context/AuthContext';
import { useUser } from '../context/UserContext'
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const Header = () => {
  const { userData, dispatchAction, undo, canUndo, saveToFirebase, loading, error } = useUser();
  const {user, logOut} = useAuth();
  const navigation = useNavigation();
  const handleMatilhas = () => {
    navigation.navigate('Matilhas' as never);
  }

  const handleMatilhaChange = (item) => {
    dispatchAction({ type: 'SELECT_FAMILY', payload: { familyHandle: item}});
  }

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login' as never);
  }

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
                <FamilyPill key="add" numberOfLines={1} onPress={handleMatilhas}>
                    <PillText>🐾 Matilhas</PillText>
                </FamilyPill>
                <FamilyPill key="favoritos" onPress={() => handleMatilhaChange("favoritos")}>
                    <PillText isActive={userData.selectedFamily==="favoritos"}>⭐ Favoritos</PillText>
                </FamilyPill>
                {userData?.families.map((familia) => (
                    <FamilyPill key={familia.handle} onPress={() => handleMatilhaChange(familia.handle)}>
                      <PillText isActive={userData.selectedFamily===familia.handle}>👥 {familia.name}</PillText>
                    </FamilyPill>
                ))}
                </HorizontalScroll>
                <FamilyPill onPress={saveToFirebase}>
                <PillText><FontAwesome name="save" size={24} color="black" /></PillText>
                </FamilyPill>
                <FamilyPill onPress={handleLogout}>
                <PillText><Ionicons style={{alignSelf: "center"}} name="exit-outline" size={24} color="black" /></PillText>
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


const PillText = styled.Text<{ isActive?: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isActive ? '#4a90e2' : '#eee')};
  color: ${(props) => (props.isActive ? '#fff' : '#333')};
  padding: 10px;
  margin: 4px;
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 30px;
  font-weight: bold;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: auto;
  min-width: 0;
    flex-shrink: 1;
    flex-grow: 1;
`;

const FamilyPill = styled.TouchableOpacity<{ isActive?: boolean }>`

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

const TitleText = styled.Text`
  font-size: 16px;
  color: rgb(60, 60, 60);
  font-weight: bolder;
  justify-content: center;
`;
