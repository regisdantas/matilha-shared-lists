import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ListItem } from './ListItem'
import { useUser } from '../context/UserContext';
import { Picker } from 'emoji-mart-native';

export const ListCard = ({list}) => {
    const { userData, dispatchAction } = useUser();
    const [value, setValue] = React.useState(list.name);
    const [isEditing, setIsEditing] = React.useState(list.initialEditing?list.initialEditing:false);
    const [isPicking, setIsPicking] = React.useState(false);
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
                text: "", 
                checked: false, 
                addedBy: userData.handle,
                initialEditing: true,
            }}}
        )
    }

    const startEditing = () => {
        setValue(list.name)
        setIsEditing(true);
    }

    const finishEditing = () => {
        dispatchAction(
          { type: 'EDIT_LIST', payload: { familyHandle: list.familyHandle, list: {...list, name: value}}}
        );
        setIsEditing(false);
    }

    const handleChangeIcon = () => {
      setIsPicking(true)
    }

    const changeIcon = (icon) => {
      dispatchAction(
          { type: 'EDIT_LIST', payload: { familyHandle: list.familyHandle, list: {...list, icon: icon.native}}}
      );
      setIsPicking(false)
    }

    const deleteList = () => {
      dispatchAction(
          { type: 'REMOVE_LIST', payload: { familyHandle: list.familyHandle, listHandle: list.handle}}
      );
    }


    return (
        <ListCardContainer>
            <ListContainer>
            <ListTitle>
                <TouchableOpacity onPress={handleChangeIcon}>
                  <Text>{(list.icon?list.icon:"📋")}</Text>
                  <Picker style={isPicking?{display: "flex"}:{display: "none"}} onSelect={(emoji) => changeIcon(emoji)}
                  set="apple" theme="dark" emojiSize={24}/>
                </TouchableOpacity>
                {isEditing ? (
                    <ListTitleInput
                    value={value}
                    autoFocus
                    onChangeText={setValue}
                    onBlur={finishEditing}
                    onSubmitEditing={finishEditing}
                    />
                ) : (
                    <ListTitleClicable onPress={startEditing}>
                        <Text style={{fontWeight: 700}}>{list.name?list.name:"Clique para editar"}</Text>
                    </ListTitleClicable>
                )}
                {/* <FamilyText style={{marginRight: 60}}>{"#" + list.handle}</FamilyText> */}
                <TouchableOpacity onPress={deleteList}>
                  <FontAwesome name="trash-o" size={18} color="black" />
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
            <FamilyText>{"&" + list.familyHandle}</FamilyText>
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
  width: 100%;
  margin-bottom: 16px;
  padding: 8px;
  opacity: 0.8;
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

const ListTitleClicable = styled.TouchableOpacity`
    flex: 1;
    flex-direction: row;
    margin-left: 10px;
`

const ListTitleInput = styled.TextInput`
  display: inline;
  flex: 1;
  margin: 0px;
  padding: 2px;
  margin-left: 10px;
  height: auto;
  width: auto;
  border: 0px;
`;

const FamilyText = styled.Text`
  color:rgb(153, 153, 153);

`