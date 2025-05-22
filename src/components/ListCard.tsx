import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ListItem } from './ListItem'
import { useUser } from '../context/UserContext';

export const ListCard = ({list}) => {
    const { userData, dispatchAction } = useUser();
    const toggleFavorite = () => {
        dispatchAction(
          { type: 'EDIT_LIST', payload: { familyHandle: list.familyHandle, list: {...list, favorite: !list.favorite} }}
        )
    }
    const addItem = () => {
      dispatchAction(
          { type: 'ADD_ITEM', payload: 
            { 
              familyHandle: list.familyHandle, 
              listHandle: list.handle, 
              item: { 
                handle: "", 
                icon: "", 
                text: "Click to edit", 
                checked: false, 
                addedBy: userData.handle,
                initialEditing: true,
            }}}
        )
    }
    return (
        <ListCardContainer>
            <ListContainer>
            <ListTitle>
                <TouchableOpacity>
                <Text>{list.emoji}</Text>
                </TouchableOpacity>
                <Text style={{fontWeight: 700}}>{list.name}</Text>
                <TouchableOpacity>
                <MaterialIcons name="menu" size={24} color="black" />
                </TouchableOpacity>
            </ListTitle>
            <ListContent>
                {list.items.map((item, ii) => (
                <ListItem key={ii} list={list} item={item}/>
                ))}
            </ListContent>
          </ListContainer>
          <ListFooter>
            <TouchableOpacity onPress={toggleFavorite}>
              <Text>{list.favorite?"⭐":"☆"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addItem}>
              <Text>➕</Text>
            </TouchableOpacity>
          </ListFooter>
        </ListCardContainer>
    )
}

const ListCardContainer = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #f7f7f7;
  border-radius: 12px;
  width: 49%;
  margin-bottom: 16px;
  padding: 8px;
`;

const ListContainer = styled.View`
  margin-bottom: 0;
  padding: 0;
`;

const ListTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ListContent = styled.View`
  margin-top: 8px;
`;

const ListFooter = styled.View`
  padding-top: 16px;
  flex-direction: row;
  justify-content: space-between;
`;