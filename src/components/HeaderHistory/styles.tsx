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


export const TopBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  

`;

export const RemoveAllButton = styled.Pressable`
  
  
  
  align-items: center;
  justify-content: center;

`