import styled from "styled-components";

export const HeaderBox = styled.View`
  flex-direction: column;
  width: 100%;
  background-color: black;
  height: 120px;
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









