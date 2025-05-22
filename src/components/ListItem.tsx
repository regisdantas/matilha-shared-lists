import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useUser } from '../context/UserContext';

export const ListItem = ({list, item}) => {
    const [value, setValue] = React.useState('Click to edit me');
    const [isEditing, setIsEditing] = React.useState(item.initialEditing?item.initialEditing:false);
    const {  dispatchAction } = useUser();
    const toggleChecked = () => {
        dispatchAction(
          { type: 'TOGGLE_ITEM', payload: { familyHandle: list.familyHandle, listHandle: list.handle, itemHandle: item.handle}}
        )
    }

    const startEditing = () => {
        setValue(item.text)
        setIsEditing(true);
    }

    const finishEditing = () => {
        dispatchAction(
          { type: 'EDIT_ITEM', payload: { familyHandle: list.familyHandle, listHandle: list.handle, item: {...item, text: value}}}
        );
        setIsEditing(false);
    }

    const removeItem = () => {
        dispatchAction(
          { type: 'REMOVE_ITEM', payload: { familyHandle: list.familyHandle, listHandle: list.handle, itemHandle: item.handle}}
        )
    }

    return (
         <ListItemContainer>
            <Text>
                <TouchableOpacity onPress={toggleChecked}>
                    <Text>{item.checked?"✅":"⬜"}</Text>
                </TouchableOpacity>
                {isEditing ? (
                    <ListInput
                    value={value}
                    autoFocus
                    onChangeText={setValue}
                    onBlur={finishEditing}
                    onSubmitEditing={finishEditing}
                    />
                ) : (
                    <ListItemClicable onPress={startEditing}>
                        <Text style={{textDecorationLine: item.checked ? 'line-through' : 'none'}}>{item.text}</Text>
                    </ListItemClicable>
                )}
            </Text>
            <TouchableOpacity onPress={removeItem}>
                <Text>❌</Text>
            </TouchableOpacity>
        </ListItemContainer>
    )
}

const ListItemClicable = styled.TouchableOpacity`
    flex: 1;
    flex-direction: row;
    border-bottom-width: 1px; 
    border-bottom-color: black;
    margin-left: 10px;
`

const ListInput = styled.TextInput`
  display: inline;
  flex: 1;
  margin: 0px;
  padding: 2px;
  margin-left: 10px;
  height: auto;
  width: auto;
  border: 0px;
`;

const ListItemContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 2px;
`;
