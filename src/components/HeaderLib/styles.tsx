import styled from "styled-components";

export const HeaderBox = styled.View`
  flex-direction: column;
  width: 100%;
  background-color: black;
  height: 150px;
  justify-content: flex-end;
  border-bottom-width: 1px;
  border-color: gray;
  padding: 20px;
  padding-bottom: 10px;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export const HeaderTitle = styled.Text`
  color: tomato;
  font-weight: 600;
  font-size: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
`;

export const TopBox = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const BottomBox = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-evenly;
  padding-top: 10px;
`;

export const Button = styled.Pressable`
  flex-direction: row;
  border-width: 1px;
  border-color: gray;
  border-radius: 20px;
  padding: 8px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  margin-left: 3px;
`;


export const InputBox = styled.TextInput`
  
  flex:1;
  width:100%;
  background-color: white;
  border-radius:5px;
  color: black;
 

`

export const BoxSearch = styled.View`
  
  flex-direction: row;
  flex:1;
  width:100%;
  align-items: center;



`

export const RemoveSearch = styled.Pressable`
  
  
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: gray;
  border-radius:10px;
  margin-left:10px;


`


export const ButtonSearch = styled.Pressable`
  
  background-color: black;
  width: 60px;
  height: 60px;
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 1;
  border-width: 1px;
  border-radius: 20px;
  border-color: white;
  elevation:60;
  align-items: center;
  justify-content: center;
`




