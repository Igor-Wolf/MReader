import styled from "styled-components";

import { Image } from "expo-image";

export const Container = styled.View`
  flex: 1;
  height: 100%;
  width: 100%;
  background-color: black;
  align-items: center;
  justify-content: center;
`;

export const ImageLogo = styled(Image)`
  width: 200px;
  height: 200px;
`;

export const TitleText = styled.Text`
  color: tomato;
  font-weight: 600;
  font-size: 40px;
`;


export const NormalText = styled.Text`
    
    color: white;
    font-size: 18px;

`
export const SubText = styled.Text`
    
    color: gray;
    font-size: 16px;

`

export const ConfigButton = styled.Pressable`
    

    background-color: tomato;
    border-radius: 10px;
    margin-top:20px;
    padding: 10px;
    align-items: center;
    justify-content: center;


`
