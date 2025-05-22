
export type Item = {
    handle: string;
    icon: string;
    text: string;
    checked: boolean;
    addedBy: string;
}

export type List = {
    handle: string;
    icon: string;
    name: string;
    favorite: boolean;
    familyHandle: string;
    items: Item[];
    ownerHandle: string;
}

export type Family = {
    handle: string;
    name: string;
    membersHandle: string[];
    lists: List[];
}

export type UserData = {
  name: string;
  handle: string;
  phone: string;
  email: string;
  families: Family[];
  selectedFamily: string;
};

export type Action =
  | { type: 'LOAD_USER_DATA'; payload: UserData }
  | { type: 'UNDO' }
  | { type: 'ADD_ITEM'; payload: { familyHandle: string; listHandle: string; item: Item } }
  | { type: 'TOGGLE_ITEM'; payload: { familyHandle: string; listHandle: string; itemHandle: string } }
  | { type: 'EDIT_ITEM'; payload: { familyHandle: string; listHandle: string; item: Item } }
  | { type: 'REMOVE_ITEM'; payload: { familyHandle: string; listHandle: string; itemHandle: string } }
  | { type: 'ADD_LIST'; payload: { familyHandle: string; list: List } }
  | { type: 'EDIT_LIST'; payload: { familyHandle: string; list: List } }
  | { type: 'REMOVE_LIST'; payload: { familyHandle: string; listHandle: string } }
  | { type: 'ADD_FAMILY'; payload: Family }
  | { type: 'EDIT_FAMILY'; payload: Family }
  | { type: 'REMOVE_FAMILY'; payload: { familyHandle: string } }
  | { type: 'SELECT_FAMILY'; payload: { familyHandle: string } };
