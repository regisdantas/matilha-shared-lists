import React from 'react';
import styled from 'styled-components/native';
import { useAuth } from '../context/AuthContext';
import { Header } from "../components/Header";
import { useUser } from '../context/UserContext';
import { ListCard } from '../components/ListCard';

export const DashboardScreen = () => {
  const { user } = useAuth();
  const { userData, dispatchAction, undo, canUndo, saveToFirebase, loading, error } = useUser();
  const getLists = () => {
    let lists = [];
    userData?.families?.map((family) => {
        console.log(userData.selectedFamily, family.handle)
        if (userData.selectedFamily === "favoritos") {
          family.lists?.map(list => list.favorite?lists.push(list):"")
        } else if (userData.selectedFamily === family.handle){
          lists = lists.concat(family.lists)
        }
      })
    return lists;
  }
  return (
    <BodyContainer>
      <Header />
      <ListScroll showsVerticalScrollIndicator={false}>
        <UserName>{user.displayName}</UserName>
        <GridWrapper>
          {getLists().map((lista, li) => (
            <ListCard key={li} list={lista}></ListCard>
          ))}
        </GridWrapper>
      </ListScroll>
      <Matilha source={require('../assets/matilha.png')} />
      <BotBar />
    </BodyContainer>
  );
};

const BodyContainer = styled.View`
  flex: 1;
  background: #B0B0B0;
`;

const UserName = styled.Text`
  text-align: center;
  font-weight: bold;
  color: #3c3c3c;
  font-size: 20px;
  font-family: impact;
  letter-spacing: 10px;
  text-transform: uppercase;
  height: 100px;
  line-height: 50px;
`;

const ListScroll = styled.ScrollView`
  padding: 16px;
  padding-top: 0px;
  padding-bottom: 140%;
`;

const GridWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Matilha = styled.Image`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-110px);
  z-index: -1;
  width: 220px;
  height: 150px;
  opacity: 0.2;
`;

const BotBar = styled.View`
  flex-direction: row;
  justify-content: center;
  background: rgb(60, 60, 60);
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`;

