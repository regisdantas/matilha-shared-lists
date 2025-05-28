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
        if (userData.selectedFamily === "favorites") {
          family.lists?.map(list => list.favorite?lists.push(list):"")
        } else if (userData.selectedFamily === family.handle){
          lists = lists.concat(family.lists)
        }
      })
    return lists;
  }

  const addList = () => {
    let familyToAdd = userData.selectedFamily;
    if (userData.selectedFamily === "favorites"){
      dispatchAction({ type: 'SELECT_FAMILY', payload: { familyHandle: userData.handle}});
      familyToAdd = userData.handle;
    }

    dispatchAction(
      { type: 'ADD_LIST', payload: { familyHandle: familyToAdd, list: {
        handle: "",
        icon: "",
        name: "",
        favorite: false,
        familyHandle: familyToAdd,
        items: [],
        ownerHandle: userData.handle,
        initialEditing: true
      } } }
    )
  }

  return (
    <BodyContainer>
      <Header />
      <ListScroll showsVerticalScrollIndicator={false}>
        <UserName>{(loading?" ":user.displayName)}</UserName>
        <GridWrapper>
          {getLists().map((lista, li) => (
            <ListCard key={li} list={lista}></ListCard>
          ))}
        </GridWrapper>
      </ListScroll>
      <Matilha source={require('../../assets/matilha.png')} />
      <BotBar />
      <AddListButton onPress={addList}>
        <ButtonText>➕</ButtonText>
      </AddListButton>
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
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

const ButtonText = styled.Text<{ isActive?: boolean }>`
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

const AddListButton = styled.TouchableOpacity<{ isActive?: boolean }>`
  position: absolute;
  bottom: 10px;
  left: calc(50% - 30px);
`;
