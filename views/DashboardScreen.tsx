import React from 'react';
import { ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {UserAuth} from '../contexts/authContext';
import { Header } from "../components/Header"


export const DashboardScreen = () => {
  const {user} = UserAuth();
  let listas = [
    {
      name: `Lista de Compras`,
      emoji: "🛒​",
      family: "Lara Dantas",
      handle: `listacompras`,
      owner: user.displayName,
      items: [
        "Carne", "Arroz", "Sabonete", "Refrigerante", "Café", "Ração"
      ] as Array<string>
    },{
      name: `Levar para Praia`,
      emoji: "🏖️​",
      family: "Lara Dantas",
      handle: `listapraia`,
      owner: user.displayName,
      items: [
        "Cooler", "Chinelo", "Protetor Solar", "Carregador", "Óculos de Sol", "Comida", "Guarda-Sol", "Cadeiras"
      ] as Array<string>
    }
  ];
  // for (let i = 0; i < 10; i++) {
  //   let l = {
  //     name: `Lista ${i+1}`,
  //     family: "Lara Dantas",
  //     handle: `lista_${i+1}`,
  //     owner: user.displayName,
  //     items: [] as Array<string>
  //   };
  //   for (let j = 0; j < 5; j++) {
  //     l.items.push(`Item ${j+1}`)
  //   }
  //   listas.push(l)
  // }

  return (
    <BodyContainer>
      <Header></Header>
      <ListScroll showsVerticalScrollIndicator={false}>
        <UserName>{user.displayName}</UserName>
        <GridWrapper>
          {listas.map((lista, li) => (
            <ListCard key={li}>
              <ListTitle>
                <TouchableOpacity>
                  {lista.emoji}
                </TouchableOpacity>
                {lista.name}
                <TouchableOpacity>
                  <MaterialIcons name="menu" size={24} color="black" />
                </TouchableOpacity>
                </ListTitle>
              <ListContent>
                {lista.items.map((item, ii) => (
                  <ListItem key={ii}>
                    <Text><TouchableOpacity><Text>✅</Text></TouchableOpacity> {item}</Text>
                    <TouchableOpacity><Text>❌</Text></TouchableOpacity>
                  </ListItem>
                ))}
              </ListContent>
              <ListFooter>
              <TouchableOpacity style={{position: "relative", bottom: "0px"}}>
                <Text>➕</Text>
              </TouchableOpacity>
              </ListFooter>
            </ListCard>
          ))}
        </GridWrapper>
      </ListScroll>
      <Matilha source={require('../assets/matilha.png')}/>
      <BotBar/>
    </BodyContainer>
  );
};

const BodyContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background: #B0B0B0;
`;

const UserName = styled.Text`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  self-align: center;
  font-weight: bold;
  color: rgb(60, 60, 60);
  font-size: 20px;
  font-family: impact;
  letter-spacing: 10px;
  color: #3c3c3c;
  align-items: top;
  self-align: center;
  text-transform: uppercase;
  height: 100px;
  padding: 0px;
`

const ListScroll = styled.ScrollView`
  padding: 16px;
  padding-top: 0px;
  margin-top: 0px;
  padding-bottom: 140%;
`;

const GridWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ListCard = styled.View`
  background-color: #f7f7f7;
  border-radius: 12px;
  width: 49%;
  margin-bottom: 16px;
  padding: 8px;
`;


const ListTitle = styled.Text`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ListContent = styled.View`
  margin-top: 8px;
`;

const ListItem = styled.Text`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
  padding-vertical: 2px;
`;

const ListFooter = styled.Text`
  padding-top: 16px;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 16px;
  font-weight: bold;
  color: #333;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 7px;
  background: rgb(60, 60, 60);
  color: white;
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: 0px;
`